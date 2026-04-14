#!/bin/bash

# Fix Lambda Function Email Configuration
# Updates all Lambda functions to use info@c3ops.io instead of info@c3ops.in

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔧 Lambda Email Configuration Fix${NC}"
echo "===================================="
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed${NC}"
    exit 1
fi

# Function to update Lambda environment variable
update_lambda_email() {
    local function_name=$1
    local env_var=$2
    
    echo -e "${YELLOW}Updating $function_name...${NC}"
    
    # Get current environment variables
    local current_env=$(aws lambda get-function-configuration --function-name "$function_name" --query 'Environment.Variables' --output json 2>/dev/null || echo '{}')
    
    # Update the email address
    local updated_env=$(echo "$current_env" | jq ".$env_var = \"info@c3ops.io\"")
    
    # Apply the update
    aws lambda update-function-configuration \
        --function-name "$function_name" \
        --environment "Variables=$(echo $updated_env | jq -c .)" 2>/dev/null
    
    echo -e "${GREEN}✓ Updated $env_var in $function_name${NC}"
}

echo "Finding Lambda functions..."
echo ""

# Get all Lambda functions
functions=$(aws lambda list-functions --query 'Functions[].FunctionName' --output text)

if [ -z "$functions" ]; then
    echo -e "${YELLOW}⚠ No Lambda functions found${NC}"
    exit 1
fi

# Update all functions that have email environment variables
updated_count=0
for func in $functions; do
    # Check if function has GMAIL_TO_EMAIL variable
    if aws lambda get-function-configuration --function-name "$func" --query 'Environment.Variables.GMAIL_TO_EMAIL' --output text 2>/dev/null | grep -q .; then
        update_lambda_email "$func" "GMAIL_TO_EMAIL"
        ((updated_count++))
    fi
    
    # Check if function has SES_ADMIN_EMAIL variable
    if aws lambda get-function-configuration --function-name "$func" --query 'Environment.Variables.SES_ADMIN_EMAIL' --output text 2>/dev/null | grep -q .; then
        update_lambda_email "$func" "SES_ADMIN_EMAIL"
        ((updated_count++))
    fi
done

echo ""
echo "===================================="
if [ $updated_count -gt 0 ]; then
    echo -e "${GREEN}✓ Successfully updated $updated_count Lambda function(s)${NC}"
    echo ""
    echo "📝 Email variables updated to:"
    echo "   GMAIL_TO_EMAIL: info@c3ops.io"
    echo "   SES_ADMIN_EMAIL: info@c3ops.io"
else
    echo -e "${YELLOW}⚠ No Lambda functions with email variables found${NC}"
fi

echo ""
echo "Next steps:"
echo "1. Test the Lambda function with a demo request"
echo "2. Verify emails are going to info@c3ops.io"
echo ""
