#!/bin/bash

# Local Lambda Testing Script
# Tests the demo request Lambda function locally using SAM

set -e

echo "🚀 C3Ops Lambda Local Testing Script"
echo "===================================="
echo ""

# Check prerequisites
echo "✓ Checking prerequisites..."

if ! command -v sam &> /dev/null; then
    echo "❌ AWS SAM CLI not found. Install with: brew install aws-sam-cli"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Install from https://nodejs.org/"
    exit 1
fi

echo "✓ Prerequisites OK"
echo ""

# Install dependencies
echo "📦 Installing Lambda dependencies..."
cd lambda
npm install --silent
cd ..
echo "✓ Dependencies installed"
echo ""

# Build SAM
echo "🔨 Building SAM application..."
sam build --quiet
echo "✓ Build complete"
echo ""

# Start local environment
echo "🌍 Starting SAM local API server..."
echo "API will be available at: http://localhost:3001/demo-requests"
echo ""
echo "Test with:"
echo "  curl -X POST http://localhost:3001/demo-requests \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"name\":\"John\",\"email\":\"john@example.com\",\"company\":\"Acme\"}'"
echo ""
echo "Press Ctrl+C to stop"
echo ""

sam local start-api --port 3001 --env-vars <(cat <<EOF
{
  "DemoRequestsFunction": {
    "S3_BUCKET_NAME": "local-demo-bucket",
    "SES_FROM_EMAIL": "info@c3ops.io",
    "SES_ADMIN_EMAIL": "info@c3ops.io",
    "AWS_REGION": "us-east-1",
    "ENVIRONMENT": "local"
  }
}
EOF
)
