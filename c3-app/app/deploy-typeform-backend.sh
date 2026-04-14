#!/bin/bash

# Deploy Typeform Backend to AWS
# This script deploys the Lambda functions and DynamoDB table

set -e

echo "🚀 Starting deployment of Typeform Backend..."

# Check if serverless is installed
if ! command -v serverless &> /dev/null; then
    echo "❌ Serverless Framework is not installed. Please install it first:"
    echo "npm install -g serverless"
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials are not configured. Please run 'aws configure' first."
    exit 1
fi

# Install dependencies in lambda directory
echo "📦 Installing Lambda dependencies..."
cd lambda
npm install
cd ..

# Deploy to development environment
echo "🏗️  Deploying to development environment..."
serverless deploy --stage dev

echo "✅ Deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Note down the API Gateway URL from the deployment output"
echo "2. Update the API_BASE_URL in TypeformModal.jsx with your actual API Gateway URL"
echo "3. Test the typeform functionality"
echo ""
echo "🔍 To view logs:"
echo "serverless logs -f submitTypeform --stage dev"
echo ""
echo "🗃️  To view DynamoDB table:"
echo "aws dynamodb scan --table-name c3ops-email-api-typeform-submissions-dev --region us-east-1"
echo ""
echo "🚮 To remove the deployment:"
echo "serverless remove --stage dev"