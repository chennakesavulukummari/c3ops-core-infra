#!/bin/bash

# Create API Gateway for C3Ops Typeform
set -e

REGION="ap-south-2"
SERVICE_NAME="c3ops-website-typeform"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

echo "🚀 Creating API Gateway for Typeform"

# Step 1: Create API Gateway
API_ID=$(aws apigateway create-rest-api \
    --region $REGION \
    --name "$SERVICE_NAME-api" \
    --description "API for C3Ops Typeform" \
    --query 'id' \
    --output text)

echo "✅ API Gateway created: $API_ID"

# Step 2: Get the root resource ID
ROOT_RESOURCE_ID=$(aws apigateway get-resources \
    --region $REGION \
    --rest-api-id $API_ID \
    --query 'items[0].id' \
    --output text)

# Step 3: Create /api resource
API_RESOURCE_ID=$(aws apigateway create-resource \
    --region $REGION \
    --rest-api-id $API_ID \
    --parent-id $ROOT_RESOURCE_ID \
    --path-part api \
    --query 'id' \
    --output text)

# Step 4: Create /api/typeform resource
TYPEFORM_RESOURCE_ID=$(aws apigateway create-resource \
    --region $REGION \
    --rest-api-id $API_ID \
    --parent-id $API_RESOURCE_ID \
    --path-part typeform \
    --query 'id' \
    --output text)

# Step 5: Create /api/typeform/submit resource
SUBMIT_RESOURCE_ID=$(aws apigateway create-resource \
    --region $REGION \
    --rest-api-id $API_ID \
    --parent-id $TYPEFORM_RESOURCE_ID \
    --path-part submit \
    --query 'id' \
    --output text)

# Step 6: Create /api/typeform/submissions resource
SUBMISSIONS_RESOURCE_ID=$(aws apigateway create-resource \
    --region $REGION \
    --rest-api-id $API_ID \
    --parent-id $TYPEFORM_RESOURCE_ID \
    --path-part submissions \
    --query 'id' \
    --output text)

# Step 7: Create POST method for submit
aws apigateway put-method \
    --region $REGION \
    --rest-api-id $API_ID \
    --resource-id $SUBMIT_RESOURCE_ID \
    --http-method POST \
    --authorization-type NONE \
    --no-api-key-required

# Enable CORS for submit
aws apigateway put-method \
    --region $REGION \
    --rest-api-id $API_ID \
    --resource-id $SUBMIT_RESOURCE_ID \
    --http-method OPTIONS \
    --authorization-type NONE \
    --no-api-key-required

# Step 8: Create GET method for submissions
aws apigateway put-method \
    --region $REGION \
    --rest-api-id $API_ID \
    --resource-id $SUBMISSIONS_RESOURCE_ID \
    --http-method GET \
    --authorization-type NONE \
    --no-api-key-required

# Enable CORS for submissions
aws apigateway put-method \
    --region $REGION \
    --rest-api-id $API_ID \
    --resource-id $SUBMISSIONS_RESOURCE_ID \
    --http-method OPTIONS \
    --authorization-type NONE \
    --no-api-key-required

# Step 9: Set up Lambda integration for submit
SUBMIT_LAMBDA_ARN="arn:aws:lambda:$REGION:$ACCOUNT_ID:function:$SERVICE_NAME-submit"
aws apigateway put-integration \
    --region $REGION \
    --rest-api-id $API_ID \
    --resource-id $SUBMIT_RESOURCE_ID \
    --http-method POST \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/$SUBMIT_LAMBDA_ARN/invocations"

# Step 10: Set up Lambda integration for get
GET_LAMBDA_ARN="arn:aws:lambda:$REGION:$ACCOUNT_ID:function:$SERVICE_NAME-get"
aws apigateway put-integration \
    --region $REGION \
    --rest-api-id $API_ID \
    --resource-id $SUBMISSIONS_RESOURCE_ID \
    --http-method GET \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/$GET_LAMBDA_ARN/invocations"

# Step 11: Set up CORS integrations
for RESOURCE_ID in $SUBMIT_RESOURCE_ID $SUBMISSIONS_RESOURCE_ID; do
    aws apigateway put-integration \
        --region $REGION \
        --rest-api-id $API_ID \
        --resource-id $RESOURCE_ID \
        --http-method OPTIONS \
        --type MOCK \
        --request-templates '{"application/json": "{\"statusCode\": 200}"}'
    
    aws apigateway put-method-response \
        --region $REGION \
        --rest-api-id $API_ID \
        --resource-id $RESOURCE_ID \
        --http-method OPTIONS \
        --status-code 200 \
        --response-parameters '{"method.response.header.Access-Control-Allow-Origin":false,"method.response.header.Access-Control-Allow-Methods":false,"method.response.header.Access-Control-Allow-Headers":false}'
    
    aws apigateway put-integration-response \
        --region $REGION \
        --rest-api-id $API_ID \
        --resource-id $RESOURCE_ID \
        --http-method OPTIONS \
        --status-code 200 \
        --response-parameters '{"method.response.header.Access-Control-Allow-Origin":"'\''*'\''","method.response.header.Access-Control-Allow-Methods":"'\''GET,POST,OPTIONS'\''","method.response.header.Access-Control-Allow-Headers":"'\''Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'\''"}'
done

# Step 12: Give API Gateway permission to invoke Lambda
aws lambda add-permission \
    --region $REGION \
    --function-name "$SERVICE_NAME-submit" \
    --statement-id apigateway-invoke-submit \
    --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:$REGION:$ACCOUNT_ID:$API_ID/*/*"

aws lambda add-permission \
    --region $REGION \
    --function-name "$SERVICE_NAME-get" \
    --statement-id apigateway-invoke-get \
    --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:$REGION:$ACCOUNT_ID:$API_ID/*/*"

# Step 13: Deploy API
aws apigateway create-deployment \
    --region $REGION \
    --rest-api-id $API_ID \
    --stage-name prod

# Get API URL
API_URL="https://$API_ID.execute-api.$REGION.amazonaws.com/prod"

echo ""
echo "🎉 API Gateway deployed successfully!"
echo ""
echo "📋 API Details:"
echo "• API ID: $API_ID"
echo "• API URL: $API_URL"
echo ""
echo "🔗 Endpoints:"
echo "• Submit: POST $API_URL/api/typeform/submit"
echo "• Get Submissions: GET $API_URL/api/typeform/submissions"
echo ""
echo "⚠️  Next Steps:"
echo "1. Update your frontend API_BASE_URL to: $API_URL"
echo "2. Verify SES email at info@c3ops.io"
echo ""
echo "🧪 Test API:"
echo "curl -X POST $API_URL/api/typeform/submit -H 'Content-Type: application/json' -d '{\"email\":\"test@example.com\"}'"