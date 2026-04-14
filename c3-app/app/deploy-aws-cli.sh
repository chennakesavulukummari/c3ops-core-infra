#!/bin/bash

# AWS CLI Commands to Deploy C3Ops Typeform Infrastructure
# Region: ap-south-2
# Naming: c3ops-website-typeform-<resource>

set -e

REGION="ap-south-2"
SERVICE_NAME="c3ops-website-typeform"

echo "🚀 Deploying C3Ops Typeform Infrastructure in region: $REGION"

# Check if AWS CLI is installed and configured
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials are not configured. Please run 'aws configure' first."
    exit 1
fi

# Get account ID for ARNs
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "📋 Using AWS Account: $ACCOUNT_ID"

echo ""
echo "=== Step 1: Create DynamoDB Table ==="

# Create DynamoDB Table
echo "Creating DynamoDB table: $SERVICE_NAME-dynamodb"

aws dynamodb create-table \
    --region $REGION \
    --table-name "$SERVICE_NAME-dynamodb" \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
        AttributeName=submittedAt,AttributeType=S \
        AttributeName=email,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --global-secondary-indexes \
        'IndexName=email-index,KeySchema=[{AttributeName=email,KeyType=HASH},{AttributeName=submittedAt,KeyType=RANGE}],Projection={ProjectionType=ALL}' \
        'IndexName=submittedAt-index,KeySchema=[{AttributeName=submittedAt,KeyType=HASH}],Projection={ProjectionType=ALL}' \
    --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES \
    --tags 'Key=Service,Value='$SERVICE_NAME',Key=Environment,Value=production'

echo "✅ DynamoDB table created successfully"

echo ""
echo "=== Step 2: Create IAM Role for Lambda ==="

# Create IAM trust policy for Lambda
cat > /tmp/lambda-trust-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "lambda.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
EOF

# Create IAM policy for DynamoDB access
cat > /tmp/lambda-dynamodb-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "arn:aws:logs:$REGION:$ACCOUNT_ID:*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:Query",
                "dynamodb:Scan",
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem"
            ],
            "Resource": [
                "arn:aws:dynamodb:$REGION:$ACCOUNT_ID:table/$SERVICE_NAME-dynamodb",
                "arn:aws:dynamodb:$REGION:$ACCOUNT_ID:table/$SERVICE_NAME-dynamodb/index/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "ses:SendEmail",
                "ses:SendRawEmail",
                "ses:GetSendQuota",
                "ses:GetSendStatistics"
            ],
            "Resource": "*"
        }
    ]
}
EOF

# Create IAM role
aws iam create-role \
    --region $REGION \
    --role-name "$SERVICE_NAME-lambda-role" \
    --assume-role-policy-document file:///tmp/lambda-trust-policy.json \
    --tags Key=Service,Value=$SERVICE_NAME

# Create and attach policy
aws iam put-role-policy \
    --region $REGION \
    --role-name "$SERVICE_NAME-lambda-role" \
    --policy-name "$SERVICE_NAME-lambda-policy" \
    --policy-document file:///tmp/lambda-dynamodb-policy.json

echo "✅ IAM role and policy created successfully"

echo ""
echo "=== Step 3: Package Lambda Functions ==="

# Create deployment package for typeform handler
cd lambda
zip -r ../typeform-handler.zip . -x "*.pyc" "__pycache__/*"
cd ..

echo "✅ Lambda function packaged"

echo ""
echo "=== Step 4: Create Lambda Functions ==="

ROLE_ARN="arn:aws:iam::$ACCOUNT_ID:role/$SERVICE_NAME-lambda-role"

# Wait for role to be ready (IAM eventual consistency)
echo "⏳ Waiting for IAM role to propagate..."
sleep 15

# Create Submit Typeform Lambda Function
aws lambda create-function \
    --region $REGION \
    --function-name "$SERVICE_NAME-submit" \
    --runtime nodejs18.x \
    --role $ROLE_ARN \
    --handler typeform-handler.submitTypeform \
    --zip-file fileb://typeform-handler.zip \
    --description "Submit typeform data to DynamoDB" \
    --timeout 30 \
    --memory-size 256 \
    --environment Variables="{DYNAMODB_TABLE=$SERVICE_NAME-dynamodb,FROM_EMAIL=info@c3ops.io}" \
    --tags Service=$SERVICE_NAME,Environment=production

# Create Get Submissions Lambda Function  
aws lambda create-function \
    --region $REGION \
    --function-name "$SERVICE_NAME-get" \
    --runtime nodejs18.x \
    --role $ROLE_ARN \
    --handler typeform-handler.getSubmissions \
    --zip-file fileb://typeform-handler.zip \
    --description "Get typeform submissions from DynamoDB" \
    --timeout 30 \
    --memory-size 256 \
    --environment Variables="{DYNAMODB_TABLE=$SERVICE_NAME-dynamodb,FROM_EMAIL=info@c3ops.io}" \
    --tags Service=$SERVICE_NAME,Environment=production

echo "✅ Lambda functions created successfully"

echo ""
echo "=== Step 5: Configure SES (Simple Email Service) ==="

# Verify info@c3ops.io email address
echo "Verifying info@c3ops.io email address for SES..."
aws ses verify-email-identity \
    --region $REGION \
    --email-address info@c3ops.io

echo "📧 Email verification sent to info@c3ops.io"
echo "⚠️  IMPORTANT: Check the inbox for info@c3ops.io and click the verification link!"
echo "   SES emails will not work until the email address is verified."

echo ""
echo "=== Step 6: Create API Gateway ==="

# Create REST API
API_ID=$(aws apigateway create-rest-api \
    --region $REGION \
    --name "$SERVICE_NAME-api" \
    --description "API Gateway for C3Ops Typeform" \
    --endpoint-configuration types=REGIONAL \
    --tags Service=$SERVICE_NAME,Environment=production \
    --query 'id' --output text)

echo "📋 API Gateway ID: $API_ID"

# Get root resource ID
ROOT_RESOURCE_ID=$(aws apigateway get-resources \
    --region $REGION \
    --rest-api-id $API_ID \
    --query 'items[0].id' --output text)

# Create /typeform resource
TYPEFORM_RESOURCE_ID=$(aws apigateway create-resource \
    --region $REGION \
    --rest-api-id $API_ID \
    --parent-id $ROOT_RESOURCE_ID \
    --path-part typeform \
    --query 'id' --output text)

# Create /typeform/submit resource
SUBMIT_RESOURCE_ID=$(aws apigateway create-resource \
    --region $REGION \
    --rest-api-id $API_ID \
    --parent-id $TYPEFORM_RESOURCE_ID \
    --path-part submit \
    --query 'id' --output text)

# Create /typeform/submissions resource
SUBMISSIONS_RESOURCE_ID=$(aws apigateway create-resource \
    --region $REGION \
    --rest-api-id $API_ID \
    --parent-id $TYPEFORM_RESOURCE_ID \
    --path-part submissions \
    --query 'id' --output text)

echo "✅ API Gateway resources created"

echo ""
echo "=== Step 7: Configure API Gateway Methods ==="

# Create POST method for submit
aws apigateway put-method \
    --region $REGION \
    --rest-api-id $API_ID \
    --resource-id $SUBMIT_RESOURCE_ID \
    --http-method POST \
    --authorization-type NONE

# Create OPTIONS method for submit (CORS)
aws apigateway put-method \
    --region $REGION \
    --rest-api-id $API_ID \
    --resource-id $SUBMIT_RESOURCE_ID \
    --http-method OPTIONS \
    --authorization-type NONE

# Create GET method for submissions
aws apigateway put-method \
    --region $REGION \
    --rest-api-id $API_ID \
    --resource-id $SUBMISSIONS_RESOURCE_ID \
    --http-method GET \
    --authorization-type NONE

# Create OPTIONS method for submissions (CORS)
aws apigateway put-method \
    --region $REGION \
    --rest-api-id $API_ID \
    --resource-id $SUBMISSIONS_RESOURCE_ID \
    --http-method OPTIONS \
    --authorization-type NONE

echo "✅ API Gateway methods created"

echo ""
echo "=== Step 8: Configure Lambda Integrations ==="

# Get Lambda function ARNs
SUBMIT_LAMBDA_ARN="arn:aws:lambda:$REGION:$ACCOUNT_ID:function:$SERVICE_NAME-submit"
GET_LAMBDA_ARN="arn:aws:lambda:$REGION:$ACCOUNT_ID:function:$SERVICE_NAME-get"

# Configure POST /typeform/submit integration
aws apigateway put-integration \
    --region $REGION \
    --rest-api-id $API_ID \
    --resource-id $SUBMIT_RESOURCE_ID \
    --http-method POST \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/$SUBMIT_LAMBDA_ARN/invocations"

# Configure GET /typeform/submissions integration
aws apigateway put-integration \
    --region $REGION \
    --rest-api-id $API_ID \
    --resource-id $SUBMISSIONS_RESOURCE_ID \
    --http-method GET \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/$GET_LAMBDA_ARN/invocations"

# Configure CORS for OPTIONS methods
aws apigateway put-integration \
    --region $REGION \
    --rest-api-id $API_ID \
    --resource-id $SUBMIT_RESOURCE_ID \
    --http-method OPTIONS \
    --type MOCK \
    --request-templates '{"application/json":"{\"statusCode\": 200}"}'

aws apigateway put-integration \
    --region $REGION \
    --rest-api-id $API_ID \
    --resource-id $SUBMISSIONS_RESOURCE_ID \
    --http-method OPTIONS \
    --type MOCK \
    --request-templates '{"application/json":"{\"statusCode\": 200}"}'

echo "✅ Lambda integrations configured"

echo ""
echo "=== Step 9: Configure Method Responses and CORS ==="

# Configure method responses for POST /submit
aws apigateway put-method-response \
    --region $REGION \
    --rest-api-id $API_ID \
    --resource-id $SUBMIT_RESOURCE_ID \
    --http-method POST \
    --status-code 200 \
    --response-parameters method.response.header.Access-Control-Allow-Origin=false

# Configure integration responses for POST /submit
aws apigateway put-integration-response \
    --region $REGION \
    --rest-api-id $API_ID \
    --resource-id $SUBMIT_RESOURCE_ID \
    --http-method POST \
    --status-code 200 \
    --response-parameters method.response.header.Access-Control-Allow-Origin="'*'"

# Configure CORS responses for OPTIONS methods
for RESOURCE_ID in $SUBMIT_RESOURCE_ID $SUBMISSIONS_RESOURCE_ID; do
    aws apigateway put-method-response \
        --region $REGION \
        --rest-api-id $API_ID \
        --resource-id $RESOURCE_ID \
        --http-method OPTIONS \
        --status-code 200 \
        --response-parameters \
            method.response.header.Access-Control-Allow-Origin=false \
            method.response.header.Access-Control-Allow-Headers=false \
            method.response.header.Access-Control-Allow-Methods=false

    aws apigateway put-integration-response \
        --region $REGION \
        --rest-api-id $API_ID \
        --resource-id $RESOURCE_ID \
        --http-method OPTIONS \
        --status-code 200 \
        --response-parameters \
            method.response.header.Access-Control-Allow-Origin="'*'" \
            method.response.header.Access-Control-Allow-Headers="'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'" \
            method.response.header.Access-Control-Allow-Methods="'GET,POST,OPTIONS'"
done

echo "✅ CORS configured"

echo ""
echo "=== Step 10: Grant API Gateway Permission to Lambda ==="

# Add permission for API Gateway to invoke Lambda functions
aws lambda add-permission \
    --region $REGION \
    --function-name "$SERVICE_NAME-submit" \
    --statement-id apigateway-invoke \
    --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:$REGION:$ACCOUNT_ID:$API_ID/*/*"

aws lambda add-permission \
    --region $REGION \
    --function-name "$SERVICE_NAME-get" \
    --statement-id apigateway-invoke \
    --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:$REGION:$ACCOUNT_ID:$API_ID/*/*"

echo "✅ Lambda permissions granted"

echo ""
echo "=== Step 11: Deploy API Gateway ==="

aws apigateway create-deployment \
    --region $REGION \
    --rest-api-id $API_ID \
    --stage-name prod \
    --stage-description "Production stage for C3Ops Typeform API"

echo "✅ API Gateway deployed"

# Clean up temporary files
rm -f /tmp/lambda-trust-policy.json /tmp/lambda-dynamodb-policy.json typeform-handler.zip

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Infrastructure Details:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌍 Region: $REGION"
echo "🗃️  DynamoDB Table: $SERVICE_NAME-dynamodb"
echo "⚡ Lambda Functions:"
echo "   - $SERVICE_NAME-submit"
echo "   - $SERVICE_NAME-get"
echo "🔗 API Gateway URL: https://$API_ID.execute-api.$REGION.amazonaws.com/prod"
echo ""
echo "📡 API Endpoints:"
echo "   POST: https://$API_ID.execute-api.$REGION.amazonaws.com/prod/typeform/submit"
echo "   GET:  https://$API_ID.execute-api.$REGION.amazonaws.com/prod/typeform/submissions"
echo ""
echo "🔧 Next Steps:"
echo "1. Update your TypeformModal.jsx with the API Gateway URL"
echo "2. Test the endpoints"
echo "3. Monitor logs: aws logs tail /aws/lambda/$SERVICE_NAME-submit --region $REGION"
echo ""
echo "🚮 To delete all resources:"
echo "aws cloudformation delete-stack --stack-name $SERVICE_NAME --region $REGION"