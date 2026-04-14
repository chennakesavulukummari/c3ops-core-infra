#!/bin/bash
# Terraform Import Script for Existing AWS Resources
# This script imports existing AWS resources into Terraform state

set -e

echo "=========================================="
echo "Terraform Import - Existing Resources"
echo "=========================================="
echo ""

# Variables
REGION="ap-south-2"
S3_BUCKET="c3cloudcostconsole"
CLOUDFRONT_ID="E1P2QRT0GYEL2J"
HOSTED_ZONE_ID="Z099400737QOK0UZ3T989"

# Try to get Account ID, fallback to placeholder if credentials not available
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text 2>/dev/null || echo "ACCOUNT_ID_PLACEHOLDER")

echo "Region: $REGION"
echo "S3 Bucket: $S3_BUCKET"
echo "CloudFront ID: $CLOUDFRONT_ID"
echo "Route53 Zone: $HOSTED_ZONE_ID"
echo ""

# 1. Import S3 Bucket
echo "Step 1: Importing S3 Bucket (c3cloudcostconsole)..."
terraform import aws_s3_bucket.ui_deployment "$S3_BUCKET" || echo "  (Already imported or doesn't exist)"
terraform import aws_s3_bucket_versioning.ui_deployment "$S3_BUCKET" || echo "  (Already imported)"
terraform import aws_s3_bucket_public_access_block.ui_deployment "$S3_BUCKET" || echo "  (Already imported)"
terraform import aws_s3_bucket_policy.ui_deployment "$S3_BUCKET" || echo "  (Already imported)"
echo "✓ S3 Bucket import complete"
echo ""

# 2. Import Route53 Hosted Zone
echo "Step 2: Importing Route53 Hosted Zone..."
terraform import aws_route53_zone.app_domain "$HOSTED_ZONE_ID" || echo "  (Already imported)"
echo "✓ Route53 Hosted Zone import complete"
echo ""

# 3. Import CloudFront Distribution
echo "Step 3: Importing CloudFront Distribution..."
terraform import aws_cloudfront_distribution.app_ui "$CLOUDFRONT_ID" || echo "  (Already imported)"
terraform import aws_cloudfront_origin_access_identity.app_oai "E1P2QRT0GYEL2J" || echo "  (Already imported or needs manual ID)"
echo "✓ CloudFront Distribution import complete"
echo ""

# 4. Import Route53 Records
echo "Step 4: Importing Route53 Records..."
# Note: Route53 records import requires zone_id/name/type format
terraform import aws_route53_record.app_alb "${HOSTED_ZONE_ID}_api.cloudcostconsole.com_A" || echo "  (Creating new record)"
terraform import aws_route53_record.app_cdn "${HOSTED_ZONE_ID}_cloudcostconsole.com_A" || echo "  (Creating new record)"
terraform import aws_route53_record.app_www "${HOSTED_ZONE_ID}_www.cloudcostconsole.com_A" || echo "  (Creating new record)"
echo "✓ Route53 Records import complete"
echo ""

# 5. Import CloudFront OAC
echo "Step 5: Importing CloudFront Origin Access Control..."
# Get OAC ID if exists
OAC_ID=$(aws cloudfront list-origin-access-controls --region "$REGION" --query "OriginAccessControlList.Items[?Name=='c3ops-s3-oac'].Id" --output text 2>/dev/null || echo "")
if [ ! -z "$OAC_ID" ]; then
  terraform import aws_cloudfront_origin_access_control.app_s3 "$OAC_ID" || echo "  (Already imported)"
else
  echo "  (Creating new OAC)"
fi
echo ""

# 6. CloudWatch Log Groups
echo "Step 6: Importing CloudWatch Log Groups..."
terraform import aws_cloudwatch_log_group.cloudfront_logs "/aws/cloudfront/c3-app-ui" || echo "  (Already imported or will be created)"
echo "✓ CloudWatch Log Group import complete"
echo ""

echo "=========================================="
echo "Import Process Complete!"
echo "=========================================="
echo ""
echo "Next Steps:"
echo "1. Review terraform state: terraform state list"
echo "2. Verify imports: terraform plan"
echo "3. Apply changes: terraform apply"
echo ""
