#!/bin/bash

# Fix Typeform Lambda Function Email Configuration
# Updates the Typeform handler Lambda function to use info@c3ops.io

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔧 Typeform Lambda Email Configuration Fix${NC}"
echo "============================================"
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed${NC}"
    exit 1
fi

# Get AWS region
REGION=$(aws configure get region)
if [ -z "$REGION" ]; then
    echo -e "${YELLOW}Enter your AWS region (e.g., ap-south-2): ${NC}"
    read REGION
fi

echo -e "${BLUE}Using region: $REGION${NC}"
echo ""

# Find typeform-related Lambda functions
echo "Finding Typeform Lambda functions..."
FUNCTIONS=$(aws lambda list-functions --region "$REGION" --query 'Functions[?contains(FunctionName, `typeform`)].FunctionName' --output text 2>/dev/null)

if [ -z "$FUNCTIONS" ]; then
    echo -e "${RED}❌ No Typeform Lambda functions found${NC}"
    echo ""
    echo "Looking for all demo-related functions..."
    FUNCTIONS=$(aws lambda list-functions --region "$REGION" --query 'Functions[?contains(FunctionName, `demo`)].FunctionName' --output text 2>/dev/null)
fi

if [ -z "$FUNCTIONS" ]; then
    echo -e "${RED}❌ No Lambda functions found${NC}"
    exit 1
fi

echo -e "${BLUE}Found functions:${NC}"
echo "$FUNCTIONS"
echo ""

# Update each function
updated_count=0
for func in $FUNCTIONS; do
    echo -e "${YELLOW}Updating $func...${NC}"
    
    # Get current environment variables
    current_env=$(aws lambda get-function-configuration \
        --function-name "$func" \
        --region "$REGION" \
        --query 'Environment.Variables' \
        --output json 2>/dev/null)
    
    if [ "$current_env" = "null" ] || [ -z "$current_env" ]; then
        current_env="{}"
    fi
    
    # Update the email addresses using jq
    updated_env=$(echo "$current_env" | jq \
        '.FROM_EMAIL = "info@c3ops.io" | 
         .ADMIN_EMAIL = "info@c3ops.io" | 
         .GMAIL_TO_EMAIL = "info@c3ops.io" | 
         .SES_ADMIN_EMAIL = "info@c3ops.io"')
    
    # Apply the update
    aws lambda update-function-configuration \
        --function-name "$func" \
        --region "$REGION" \
        --environment "Variables=$(echo "$updated_env" | jq -c .)" > /dev/null 2>&1
    
    echo -e "${GREEN}✓ Updated $func${NC}"
    ((updated_count++))
done

echo ""
echo "============================================"
if [ $updated_count -gt 0 ]; then
    echo -e "${GREEN}✓ Successfully updated $updated_count Lambda function(s)${NC}"
    echo ""
    echo -e "${BLUE}Email variables updated to:${NC}"
    echo "   FROM_EMAIL: info@c3ops.io"
    echo "   ADMIN_EMAIL: info@c3ops.io"
    echo "   GMAIL_TO_EMAIL: info@c3ops.io"
    echo "   SES_ADMIN_EMAIL: info@c3ops.io"
else
    echo -e "${YELLOW}⚠ No Lambda functions updated${NC}"
fi

echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Submit a test form at https://www.c3ops.io"
echo "2. Check email inbox for info@c3ops.io"
echo "3. Verify the submission was received correctly"
echo ""
