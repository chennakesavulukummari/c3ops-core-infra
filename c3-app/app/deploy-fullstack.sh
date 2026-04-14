#!/bin/bash

# C3Ops Full Stack Deployment Script
# Deploys backend to AWS Lambda and frontend to S3

set -e  # Exit on error

echo "🚀 C3Ops Deployment Script"
echo "================================"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first:"
    echo "   brew install awscli"
    exit 1
fi

# Check if SAM CLI is installed
if ! command -v sam &> /dev/null; then
    echo "❌ AWS SAM CLI is not installed. Installing..."
    brew install aws-sam-cli
fi

# Get configuration
echo ""
echo "📋 Configuration"
read -p "Enter your S3 bucket name: " S3_BUCKET
read -p "Enter Gmail App Password (from .env): " -s GMAIL_PASSWORD
echo ""

# Step 1: Deploy Backend to Lambda
echo ""
echo "📦 Step 1: Deploying Backend to AWS Lambda..."
cd "$(dirname "$0")"

# Install Lambda dependencies
echo "Installing Lambda dependencies..."
cd lambda
npm install
cd ..

# Build SAM application
echo "Building SAM application..."
sam build

# Deploy SAM application
echo "Deploying to AWS Lambda + API Gateway..."
sam deploy \
  --stack-name c3ops-email-api \
  --parameter-overrides \
    GmailUser=info@c3ops.io \
    GmailAppPassword=$GMAIL_PASSWORD \
    GmailToEmail=info@c3ops.io \
  --capabilities CAPABILITY_IAM \
  --resolve-s3 \
  --no-confirm-changeset

# Get API endpoint
API_URL=$(aws cloudformation describe-stacks \
  --stack-name c3ops-email-api \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
  --output text)

echo "✅ Backend deployed successfully!"
echo "📍 API Endpoint: $API_URL"

# Step 2: Update frontend configuration
echo ""
echo "🔧 Step 2: Updating Frontend Configuration..."

# Update .env file
cat > .env << EOF
# Gmail SMTP Configuration (for local development)
GMAIL_USER=info@c3ops.io
GMAIL_APP_PASSWORD=$GMAIL_PASSWORD
GMAIL_TO_EMAIL=info@c3ops.io

# Production API Configuration
VITE_API_URL=$API_URL

# Local Development
PORT=3001
EOF

echo "✅ .env updated with production API URL"

# Step 3: Build frontend
echo ""
echo "🏗️  Step 3: Building Frontend..."
npm run build

# Step 4: Deploy to S3
echo ""
echo "📤 Step 4: Deploying Frontend to S3..."
aws s3 sync dist/ s3://$S3_BUCKET --delete

echo ""
echo "✅ Deployment Complete!"
echo "================================"
echo "Frontend URL: http://$S3_BUCKET.s3-website-$(aws configure get region).amazonaws.com"
echo "API URL: $API_URL"
echo ""
echo "🧪 Test your API:"
echo "curl -X POST $API_URL/api/send-demo-request \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"name\":\"Test\",\"email\":\"test@test.com\",\"company\":\"Test Co\"}'"
