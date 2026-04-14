#!/bin/bash

# Deploy C3Ops Typeform Infrastructure using CloudFormation
# Region: ap-south-2

set -e

REGION="ap-south-2"
STACK_NAME="c3ops-website-typeform"
TEMPLATE_FILE="cloudformation-template.yaml"

echo "🚀 Deploying C3Ops Typeform Infrastructure using CloudFormation"
echo "📍 Region: $REGION"
echo "📋 Stack Name: $STACK_NAME"

# Check if AWS CLI is installed and configured
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials are not configured. Please run 'aws configure' first."
    exit 1
fi

# Deploy CloudFormation stack
echo "🏗️  Deploying CloudFormation stack..."

aws cloudformation deploy \
    --region $REGION \
    --template-file $TEMPLATE_FILE \
    --stack-name $STACK_NAME \
    --capabilities CAPABILITY_NAMED_IAM \
    --parameter-overrides ServiceName=$STACK_NAME

echo "✅ CloudFormation deployment completed!"

# Get stack outputs
echo ""
echo "📋 Stack Outputs:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

aws cloudformation describe-stacks \
    --region $REGION \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs' \
    --output table

# Get the API Gateway URL for easy copying
API_URL=$(aws cloudformation describe-stacks \
    --region $REGION \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`ApiGatewayUrl`].OutputValue' \
    --output text)

echo ""
echo "🔗 API Gateway URL: $API_URL"
echo ""
echo "📡 API Endpoints:"
echo "   POST: $API_URL/typeform/submit"
echo "   GET:  $API_URL/typeform/submissions"
echo ""
echo "⚠️  IMPORTANT: You still need to update the Lambda function code!"
echo "   The CloudFormation template creates placeholder Lambda functions."
echo "   Use the following commands to update them with your actual code:"
echo ""
echo "   # Package your Lambda code"
echo "   cd lambda && zip -r ../lambda-code.zip . && cd .."
echo ""
echo "   # Update Submit Lambda function"
echo "   aws lambda update-function-code \\"
echo "       --region $REGION \\"
echo "       --function-name $STACK_NAME-submit \\"
echo "       --zip-file fileb://lambda-code.zip"
echo ""
echo "   # Update Get Submissions Lambda function"  
echo "   aws lambda update-function-code \\"
echo "       --region $REGION \\"
echo "       --function-name $STACK_NAME-get \\"
echo "       --zip-file fileb://lambda-code.zip"
echo ""
echo "🔧 Next Steps:"
echo "1. Update Lambda function code (see commands above)"
echo "2. Update your TypeformModal.jsx with the API Gateway URL: $API_URL"
echo "3. Test the endpoints"
echo ""
echo "🚮 To delete the stack:"
echo "aws cloudformation delete-stack --stack-name $STACK_NAME --region $REGION"