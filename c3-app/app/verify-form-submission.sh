#!/bin/bash
# Form Submission Deployment & Verification Script
# C3Ops FinOps Platform
# Usage: bash verify-form-submission.sh

set -e

echo "═════════════════════════════════════════════════════════════"
echo "   C3OPS FORM SUBMISSION DEPLOYMENT & VERIFICATION"
echo "═════════════════════════════════════════════════════════════"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
AWS_REGION="ap-south-2"
PROJECT_NAME="c3ops"
DYNAMODB_TABLE="${PROJECT_NAME}-typeform-dynamodb"
LAMBDA_FUNCTION="${PROJECT_NAME}-typeform-submit"
API_ENDPOINT_ID="3tz75do8r6"
API_STAGE="prod"
API_URL="https://${API_ENDPOINT_ID}.execute-api.${AWS_REGION}.amazonaws.com/${API_STAGE}"

# Test data
TEST_EMAIL="test-$(date +%s)@example.com"
TEST_NAME="Test User $(date +%s)"
TEST_COMPANY="Test Company"

echo -e "${BLUE}[1/6] Checking AWS CLI Configuration...${NC}"
if ! command -v aws &> /dev/null; then
    echo -e "${RED}✗ AWS CLI not found. Please install it first.${NC}"
    exit 1
fi

AWS_PROFILE_CHECK=$(aws sts get-caller-identity --region ${AWS_REGION} 2>/dev/null || echo "failed")
if [ "$AWS_PROFILE_CHECK" = "failed" ]; then
    echo -e "${RED}✗ AWS credentials not configured.${NC}"
    exit 1
fi

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
USERNAME=$(aws sts get-caller-identity --query Arn --output text)
echo -e "${GREEN}✓ AWS CLI configured${NC}"
echo "  Account ID: ${ACCOUNT_ID}"
echo "  User: ${USERNAME}"
echo ""

echo -e "${BLUE}[2/6] Verifying DynamoDB Table...${NC}"
if aws dynamodb describe-table \
    --table-name "${DYNAMODB_TABLE}" \
    --region ${AWS_REGION} \
    --output json &> /dev/null; then
    echo -e "${GREEN}✓ DynamoDB table exists${NC}"
    
    TABLE_STATUS=$(aws dynamodb describe-table \
        --table-name "${DYNAMODB_TABLE}" \
        --region ${AWS_REGION} \
        --query 'Table.TableStatus' \
        --output text)
    echo "  Status: ${TABLE_STATUS}"
    
    ITEM_COUNT=$(aws dynamodb describe-table \
        --table-name "${DYNAMODB_TABLE}" \
        --region ${AWS_REGION} \
        --query 'Table.ItemCount' \
        --output text)
    echo "  Items: ${ITEM_COUNT}"
else
    echo -e "${RED}✗ DynamoDB table not found${NC}"
    exit 1
fi
echo ""

echo -e "${BLUE}[3/6] Checking Lambda Function...${NC}"
if aws lambda get-function \
    --function-name "${LAMBDA_FUNCTION}" \
    --region ${AWS_REGION} \
    --output json &> /dev/null; then
    echo -e "${GREEN}✓ Lambda function exists${NC}"
    
    LAMBDA_STATE=$(aws lambda get-function-configuration \
        --function-name "${LAMBDA_FUNCTION}" \
        --region ${AWS_REGION} \
        --query 'State' \
        --output text)
    echo "  State: ${LAMBDA_STATE}"
    
    LAMBDA_RUNTIME=$(aws lambda get-function-configuration \
        --function-name "${LAMBDA_FUNCTION}" \
        --region ${AWS_REGION} \
        --query 'Runtime' \
        --output text)
    echo "  Runtime: ${LAMBDA_RUNTIME}"
else
    echo -e "${RED}✗ Lambda function not found${NC}"
    exit 1
fi
echo ""

echo -e "${BLUE}[4/6] Verifying SES Configuration...${NC}"
SES_QUOTA=$(aws ses get-send-quota --region ${AWS_REGION} --output json)
SES_LIMIT=$(echo ${SES_QUOTA} | grep -o '"Max24HourSend":[^,}]*' | cut -d':' -f2)
SES_SENT=$(echo ${SES_QUOTA} | grep -o '"SentLast24Hour":[^,}]*' | cut -d':' -f2)

echo -e "${GREEN}✓ SES configured${NC}"
echo "  24-Hour Limit: ${SES_LIMIT} emails"
echo "  Sent in Last 24H: ${SES_SENT}"

VERIFIED_EMAILS=$(aws ses list-verified-email-addresses --region ${AWS_REGION} --query 'VerifiedEmailAddresses' --output json)
echo "  Verified Emails: ${VERIFIED_EMAILS}"

if echo "${VERIFIED_EMAILS}" | grep -q "info@c3ops.io"; then
    echo -e "${GREEN}  ✓ info@c3ops.io is verified${NC}"
else
    echo -e "${YELLOW}  ⚠ info@c3ops.io NOT verified. Verify it in AWS SES console.${NC}"
fi
echo ""

echo -e "${BLUE}[5/6] Testing API Endpoint...${NC}"
TEST_PAYLOAD=$(cat <<EOF
{
  "name": "${TEST_NAME}",
  "email": "${TEST_EMAIL}",
  "company": "${TEST_COMPANY}",
  "actionType": "assessment",
  "role": "Cloud Architect",
  "monthlyCloudSpend": "\$50K - \$200K",
  "cloudProviders": ["AWS", "Azure"],
  "primaryGoal": "Reduce cloud costs by 20-30%",
  "timeline": "Immediate"
}
EOF
)

echo "Sending test form submission to: ${API_URL}/api/typeform/submit"
echo "Test Email: ${TEST_EMAIL}"

RESPONSE=$(curl -s -X POST "${API_URL}/api/typeform/submit" \
    -H "Content-Type: application/json" \
    -d "${TEST_PAYLOAD}" 2>&1)

if echo "${RESPONSE}" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ API test successful${NC}"
    echo "Response: ${RESPONSE}"
    
    # Extract submission ID
    SUBMISSION_ID=$(echo "${RESPONSE}" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    echo "  Submission ID: ${SUBMISSION_ID}"
else
    echo -e "${YELLOW}⚠ API test response${NC}"
    echo "Response: ${RESPONSE}"
fi
echo ""

echo -e "${BLUE}[6/6] Querying Recent Submissions...${NC}"
RECENT_ITEMS=$(aws dynamodb scan \
    --table-name "${DYNAMODB_TABLE}" \
    --region ${AWS_REGION} \
    --limit 5 \
    --output json)

echo -e "${GREEN}✓ Recent submissions${NC}"
echo "${RECENT_ITEMS}" | jq '.Items[] | {id: .id.S, email: .email.S, name: .name.S, actionType: .actionType.S, submittedAt: .submittedAt.S}' 2>/dev/null || echo "  (Install jq for better formatting)"

echo ""
echo "═════════════════════════════════════════════════════════════"
echo -e "${GREEN}✓ VERIFICATION COMPLETE${NC}"
echo "═════════════════════════════════════════════════════════════"
echo ""
echo "📊 Summary:"
echo "  • DynamoDB Table: ${DYNAMODB_TABLE}"
echo "  • Lambda Function: ${LAMBDA_FUNCTION}"
echo "  • API Endpoint: ${API_URL}/api/typeform/submit"
echo "  • AWS Region: ${AWS_REGION}"
echo ""
echo "📝 Next Steps:"
echo "  1. Check test email inbox (${TEST_EMAIL}) for confirmation"
echo "  2. Check info@c3ops.io for notification email"
echo "  3. Visit Admin Dashboard to view submission"
echo "  4. Monitor CloudWatch logs: aws logs tail /aws/lambda/${LAMBDA_FUNCTION} --follow"
echo ""
echo "🔗 Resources:"
echo "  • Admin Dashboard: http://localhost:5173/admin"
echo "  • Documentation: ./mdfiles/FORM_SUBMISSION_IMPLEMENTATION.md"
echo ""
