#!/bin/bash

# C3Ops Website - S3 Deployment Script
# This script deploys the built React app to an S3 bucket configured for static website hosting

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BUCKET_NAME="${S3_BUCKET_NAME:-}"
AWS_REGION="${AWS_REGION:-ap-south-2}"
DIST_DIR="dist"
CLOUDFRONT_ID="${CLOUDFRONT_DISTRIBUTION_ID:-}"

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   C3Ops Website - S3 Deployment Script        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

# Check if bucket name is provided
if [ -z "$BUCKET_NAME" ]; then
  echo -e "${YELLOW}S3 bucket name not set in environment variable.${NC}"
  read -p "Enter your S3 bucket name: " BUCKET_NAME
  
  if [ -z "$BUCKET_NAME" ]; then
    echo -e "${RED}Error: Bucket name is required!${NC}"
    exit 1
  fi
fi

echo -e "${BLUE}Configuration:${NC}"
echo -e "  Bucket: ${GREEN}$BUCKET_NAME${NC}"
echo -e "  Region: ${GREEN}$AWS_REGION${NC}"
echo -e "  Distribution: ${DIST_DIR}"
echo ""

# Check if dist directory exists
if [ ! -d "$DIST_DIR" ]; then
  echo -e "${RED}Error: $DIST_DIR directory not found!${NC}"
  echo -e "${YELLOW}Run 'npm run build' first to create the production build.${NC}"
  exit 1
fi

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
  echo -e "${RED}Error: AWS CLI is not installed!${NC}"
  echo -e "${YELLOW}Install it from: https://aws.amazon.com/cli/${NC}"
  exit 1
fi

# Check if bucket exists
echo -e "${BLUE}Checking if bucket exists...${NC}"
if aws s3api head-bucket --bucket "$BUCKET_NAME" 2>/dev/null; then
  echo -e "${GREEN}✓ Bucket exists${NC}"
else
  echo -e "${YELLOW}Bucket does not exist. Creating...${NC}"
  read -p "Create bucket '$BUCKET_NAME' in region '$AWS_REGION'? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ "$AWS_REGION" == "us-east-1" ]; then
      aws s3api create-bucket --bucket "$BUCKET_NAME" --region "$AWS_REGION"
    else
      aws s3api create-bucket --bucket "$BUCKET_NAME" --region "$AWS_REGION" \
        --create-bucket-configuration LocationConstraint="$AWS_REGION"
    fi
    echo -e "${GREEN}✓ Bucket created${NC}"
  else
    echo -e "${RED}Deployment cancelled${NC}"
    exit 1
  fi
fi

# Configure bucket for static website hosting
echo -e "${BLUE}Configuring bucket for static website hosting...${NC}"
aws s3 website "s3://$BUCKET_NAME" --index-document index.html --error-document index.html
echo -e "${GREEN}✓ Static website hosting enabled${NC}"

# Set bucket policy for public read access
echo -e "${BLUE}Setting bucket policy for public access...${NC}"
BUCKET_POLICY=$(cat <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
    }
  ]
}
EOF
)

echo "$BUCKET_POLICY" > /tmp/bucket-policy.json
aws s3api put-bucket-policy --bucket "$BUCKET_NAME" --policy file:///tmp/bucket-policy.json
rm /tmp/bucket-policy.json
echo -e "${GREEN}✓ Bucket policy set${NC}"

# Disable Block Public Access settings
echo -e "${BLUE}Configuring public access settings...${NC}"
aws s3api put-public-access-block --bucket "$BUCKET_NAME" \
  --public-access-block-configuration \
  "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
echo -e "${GREEN}✓ Public access configured${NC}"

# Sync files to S3
echo -e "${BLUE}Uploading files to S3...${NC}"
aws s3 sync "$DIST_DIR" "s3://$BUCKET_NAME" \
  --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "index.html" \
  --exclude "*.txt" \
  --exclude "*.xml"

# Upload index.html with no-cache (for SPA routing)
aws s3 cp "$DIST_DIR/index.html" "s3://$BUCKET_NAME/index.html" \
  --content-type "text/html" \
  --cache-control "no-cache, no-store, must-revalidate"

# Upload other non-cached files
if [ -f "$DIST_DIR/robots.txt" ]; then
  aws s3 cp "$DIST_DIR/robots.txt" "s3://$BUCKET_NAME/robots.txt" \
    --content-type "text/plain" \
    --cache-control "no-cache"
fi

if [ -f "$DIST_DIR/sitemap.xml" ]; then
  aws s3 cp "$DIST_DIR/sitemap.xml" "s3://$BUCKET_NAME/sitemap.xml" \
    --content-type "application/xml" \
    --cache-control "no-cache"
fi

if [ -f "$DIST_DIR/manifest.json" ]; then
  aws s3 cp "$DIST_DIR/manifest.json" "s3://$BUCKET_NAME/manifest.json" \
    --content-type "application/json" \
    --cache-control "no-cache"
fi

echo -e "${GREEN}✓ Files uploaded successfully${NC}"

# Invalidate CloudFront cache if distribution ID is provided
if [ -n "$CLOUDFRONT_ID" ]; then
  echo -e "${BLUE}Invalidating CloudFront cache...${NC}"
  aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_ID" --paths "/*"
  echo -e "${GREEN}✓ CloudFront cache invalidated${NC}"
fi

# Get website endpoint
WEBSITE_ENDPOINT="http://$BUCKET_NAME.s3-website-$AWS_REGION.amazonaws.com"

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          Deployment Successful! 🚀             ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Website URL:${NC}"
echo -e "  ${GREEN}$WEBSITE_ENDPOINT${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "  1. Configure custom domain (optional)"
echo -e "  2. Set up CloudFront CDN (recommended)"
echo -e "  3. Enable HTTPS with ACM certificate"
echo -e "  4. Update DNS records"
echo ""
echo -e "${BLUE}For CloudFront setup, set CLOUDFRONT_DISTRIBUTION_ID env variable${NC}"
echo ""
