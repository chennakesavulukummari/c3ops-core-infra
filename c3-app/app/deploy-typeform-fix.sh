#!/bin/bash

# One-Command Typeform Lambda Deployment
# Usage: ./deploy-typeform-fix.sh <function-name> [region]
# Example: ./deploy-typeform-fix.sh c3ops-website-typeform-submit ap-south-2

set -e

FUNCTION_NAME=${1:-"c3ops-website-typeform-submit"}
REGION=${2:-"ap-south-2"}
ZIP_FILE="/Users/ck/c3ops-repos/c3ops-website/lambda/typeform-handler.zip"

echo "🚀 Deploying Typeform Lambda Fix"
echo "=================================="
echo "Function: $FUNCTION_NAME"
echo "Region: $REGION"
echo "Package: $ZIP_FILE"
echo ""

# Check if zip file exists
if [ ! -f "$ZIP_FILE" ]; then
    echo "❌ Zip file not found: $ZIP_FILE"
    echo "Building Lambda package..."
    cd "$(dirname "$ZIP_FILE")"
    npm install --production
    zip -r typeform-handler.zip typeform-handler.js node_modules/
fi

# Upload new code
echo "📤 Uploading Lambda function code..."
aws lambda update-function-code \
    --function-name "$FUNCTION_NAME" \
    --region "$REGION" \
    --zip-file fileb://"$ZIP_FILE"

echo "✅ Code uploaded successfully"

# Update environment variables
echo ""
echo "🔧 Updating environment variables..."
aws lambda update-function-configuration \
    --function-name "$FUNCTION_NAME" \
    --region "$REGION" \
    --environment Variables='{
        FROM_EMAIL=info@c3ops.io,
        ADMIN_EMAIL=info@c3ops.io
    }'

echo "✅ Environment variables updated"

echo ""
echo "=================================="
echo "✅ Deployment Complete!"
echo ""
echo "Next: Test the form at https://www.c3ops.io"
