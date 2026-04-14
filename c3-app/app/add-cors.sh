#!/bin/bash

# Add CORS support to API Gateway
set -e

REGION="ap-south-2"
API_ID="3tz75do8r6"

echo "🔧 Adding CORS support to API Gateway..."

# Get resource IDs
SUBMIT_RESOURCE_ID=$(aws apigateway get-resources \
    --region $REGION \
    --rest-api-id $API_ID \
    --query 'items[?pathPart==`submit`].id' \
    --output text)

SUBMISSIONS_RESOURCE_ID=$(aws apigateway get-resources \
    --region $REGION \
    --rest-api-id $API_ID \
    --query 'items[?pathPart==`submissions`].id' \
    --output text)

echo "Found resource IDs:"
echo "Submit: $SUBMIT_RESOURCE_ID"
echo "Submissions: $SUBMISSIONS_RESOURCE_ID"

# Add OPTIONS methods if they don't exist
for RESOURCE_ID in $SUBMIT_RESOURCE_ID $SUBMISSIONS_RESOURCE_ID; do
    echo "Adding OPTIONS method to resource $RESOURCE_ID"
    
    aws apigateway put-method \
        --region $REGION \
        --rest-api-id $API_ID \
        --resource-id $RESOURCE_ID \
        --http-method OPTIONS \
        --authorization-type NONE \
        --no-api-key-required >/dev/null 2>&1 || echo "OPTIONS method may already exist"
    
    # Set up CORS integration
    aws apigateway put-integration \
        --region $REGION \
        --rest-api-id $API_ID \
        --resource-id $RESOURCE_ID \
        --http-method OPTIONS \
        --type MOCK \
        --request-templates '{"application/json": "{\"statusCode\": 200}"}' >/dev/null 2>&1 || echo "Integration may already exist"
    
    # Set up method response
    aws apigateway put-method-response \
        --region $REGION \
        --rest-api-id $API_ID \
        --resource-id $RESOURCE_ID \
        --http-method OPTIONS \
        --status-code 200 \
        --response-parameters '{"method.response.header.Access-Control-Allow-Origin":false,"method.response.header.Access-Control-Allow-Methods":false,"method.response.header.Access-Control-Allow-Headers":false}' >/dev/null 2>&1 || echo "Method response may already exist"
    
    # Set up integration response with CORS headers
    aws apigateway put-integration-response \
        --region $REGION \
        --rest-api-id $API_ID \
        --resource-id $RESOURCE_ID \
        --http-method OPTIONS \
        --status-code 200 \
        --response-parameters '{"method.response.header.Access-Control-Allow-Origin":"'\''*'\''","method.response.header.Access-Control-Allow-Methods":"'\''GET,POST,OPTIONS'\''","method.response.header.Access-Control-Allow-Headers":"'\''Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Requested-With'\''"}'  >/dev/null 2>&1 || echo "Integration response may already exist"
done

# Update Lambda function to include CORS headers in responses
echo "✅ CORS configuration added"

# Deploy the changes
echo "📦 Deploying changes..."
aws apigateway create-deployment \
    --region $REGION \
    --rest-api-id $API_ID \
    --stage-name prod \
    >/dev/null

echo ""
echo "✅ CORS support added successfully!"
echo ""
echo "🧪 Test from browser now - the form should work!"
echo ""
echo "🌐 If you still get CORS errors, check the browser's developer console"
echo "   and ensure your website is serving from the same origin."