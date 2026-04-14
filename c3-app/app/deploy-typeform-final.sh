#!/bin/bash

# Typeform Email Fix - Complete Deployment Command
# This script deploys the fixed typeform handler to AWS Lambda

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Typeform Email Fix - AWS Lambda Deployment               ║${NC}"
echo -e "${BLUE}║  Fix: info@c3ops.in → info@c3ops.io                       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Configuration
REGION="ap-south-2"
FUNCTION_NAME="c3ops-website-typeform-submit"
ZIP_FILE="$(pwd)/lambda/typeform-handler.zip"
AWS_PROFILE="${1:-default}"

echo -e "${YELLOW}📋 Configuration:${NC}"
echo "  Region: $REGION"
echo "  Function: $FUNCTION_NAME"
echo "  Package: $ZIP_FILE"
echo "  AWS Profile: $AWS_PROFILE"
echo ""

# Check Prerequisites
echo -e "${YELLOW}🔍 Checking Prerequisites...${NC}"

if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI not found${NC}"
    echo "Install: brew install awscli"
    exit 1
fi
echo -e "${GREEN}✓ AWS CLI found${NC}"

if [ ! -f "$ZIP_FILE" ]; then
    echo -e "${RED}❌ Zip file not found: $ZIP_FILE${NC}"
    echo "Building package..."
    cd lambda
    npm install --production
    zip -r typeform-handler.zip typeform-handler.js node_modules/
    cd ..
fi
echo -e "${GREEN}✓ Deployment package ready ($(du -h $ZIP_FILE | cut -f1))${NC}"

# Verify AWS Credentials
echo -e "${YELLOW}🔐 Verifying AWS Credentials...${NC}"
if ! aws sts get-caller-identity --region $REGION --profile $AWS_PROFILE &>/dev/null; then
    echo -e "${RED}❌ AWS credentials not configured for profile: $AWS_PROFILE${NC}"
    echo "Run: aws configure --profile $AWS_PROFILE"
    exit 1
fi
echo -e "${GREEN}✓ AWS credentials verified${NC}"

echo ""
echo -e "${YELLOW}📤 Deploying to AWS Lambda...${NC}"

# Step 1: Upload code
echo ""
echo -e "${BLUE}Step 1/2: Uploading Lambda code...${NC}"
if aws lambda update-function-code \
    --function-name "$FUNCTION_NAME" \
    --region "$REGION" \
    --profile "$AWS_PROFILE" \
    --zip-file "fileb://$ZIP_FILE" &>/dev/null; then
    echo -e "${GREEN}✓ Code uploaded successfully${NC}"
else
    echo -e "${RED}❌ Failed to upload code${NC}"
    echo "Verify function name and AWS permissions"
    exit 1
fi

# Step 2: Update environment variables
echo ""
echo -e "${BLUE}Step 2/2: Updating environment variables...${NC}"
if aws lambda update-function-configuration \
    --function-name "$FUNCTION_NAME" \
    --region "$REGION" \
    --profile "$AWS_PROFILE" \
    --environment Variables='{FROM_EMAIL=info@c3ops.io,ADMIN_EMAIL=info@c3ops.io}' &>/dev/null; then
    echo -e "${GREEN}✓ Environment variables updated${NC}"
else
    echo -e "${RED}❌ Failed to update environment variables${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Deployment Successful!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"

echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo "1. Test the form at https://www.c3ops.io"
echo "2. Submit a demo request or contact form"
echo "3. Check info@c3ops.io for confirmation email"
echo "4. Verify admin receives notification"
echo ""

echo -e "${YELLOW}🔍 To Check Logs:${NC}"
echo "aws logs tail /aws/lambda/$FUNCTION_NAME --follow --region $REGION"
echo ""

echo -e "${YELLOW}📊 To Verify Configuration:${NC}"
echo "aws lambda get-function-configuration --function-name $FUNCTION_NAME --region $REGION --query 'Environment.Variables'"
echo ""

echo -e "${BLUE}ℹ️  For detailed information, see:${NC}"
echo "  • TYPEFORM_FIX_SUMMARY.md"
echo "  • TYPEFORM_FIX_CHECKLIST.md"
echo "  • DEPLOY_TYPEFORM_FIX.md"
echo ""
