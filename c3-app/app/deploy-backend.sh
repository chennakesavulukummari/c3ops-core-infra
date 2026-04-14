#!/bin/bash

echo "🚀 C3Ops Backend Deployment to AWS Lambda"
echo "=========================================="

# Check if serverless is installed
if ! command -v serverless &> /dev/null; then
    echo "❌ Serverless Framework not found. Installing..."
    npm install -g serverless
fi

# Install dependencies
echo "📦 Installing serverless dependencies..."
npm install --save serverless-http serverless-offline

# Set environment variables
export GMAIL_USER="info@c3ops.io"
export GMAIL_APP_PASSWORD="[YOUR_GMAIL_APP_PASSWORD]"
export GMAIL_TO_EMAIL="info@c3ops.io"

# Deploy to AWS
echo "☁️  Deploying to AWS Lambda..."
serverless deploy

# Get the API Gateway URL
echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Copy the API Gateway endpoint URL from above"
echo "2. Update .env file: VITE_API_URL=<your-api-gateway-url>"
echo "3. Rebuild frontend: npm run build"
echo "4. Deploy to S3: ./deploy-to-s3.sh"
echo ""
