#!/bin/bash

# Simplified AWS CLI deployment for C3Ops Typeform Infrastructure
set -e

REGION="ap-south-2"
SERVICE_NAME="c3ops-website-typeform"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

echo "🚀 Deploying C3Ops Typeform Infrastructure (Simplified)"
echo "📍 Region: $REGION"
echo "📋 Account: $ACCOUNT_ID"

# Step 1: Create DynamoDB Table (simplified)
echo "Creating DynamoDB table..."
aws dynamodb create-table \
    --region $REGION \
    --table-name "$SERVICE_NAME-dynamodb" \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --tags 'Key=Service,Value='$SERVICE_NAME

echo "✅ DynamoDB table created"

# Step 2: Create IAM role
echo "Creating IAM role..."
cat > /tmp/trust-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {"Service": "lambda.amazonaws.com"},
            "Action": "sts:AssumeRole"
        }
    ]
}
EOF

aws iam create-role \
    --role-name "$SERVICE_NAME-lambda-role" \
    --assume-role-policy-document file:///tmp/trust-policy.json

# Attach basic Lambda execution policy
aws iam attach-role-policy \
    --role-name "$SERVICE_NAME-lambda-role" \
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

# Create and attach custom policy
cat > /tmp/lambda-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:PutItem",
                "dynamodb:GetItem",
                "dynamodb:Scan",
                "dynamodb:Query"
            ],
            "Resource": "arn:aws:dynamodb:$REGION:$ACCOUNT_ID:table/$SERVICE_NAME-dynamodb"
        },
        {
            "Effect": "Allow",
            "Action": [
                "ses:SendEmail",
                "ses:SendRawEmail"
            ],
            "Resource": "*"
        }
    ]
}
EOF

aws iam put-role-policy \
    --role-name "$SERVICE_NAME-lambda-role" \
    --policy-name "$SERVICE_NAME-policy" \
    --policy-document file:///tmp/lambda-policy.json

echo "✅ IAM role created"

# Step 3: Package and create Lambda functions
echo "Creating Lambda package..."
cd lambda
zip -r ../lambda-package.zip . >/dev/null 2>&1
cd ..

# Wait for IAM role to propagate
echo "⏳ Waiting for IAM role to propagate..."
sleep 15

ROLE_ARN="arn:aws:iam::$ACCOUNT_ID:role/$SERVICE_NAME-lambda-role"

# Create submit function
aws lambda create-function \
    --region $REGION \
    --function-name "$SERVICE_NAME-submit" \
    --runtime nodejs18.x \
    --role $ROLE_ARN \
    --handler typeform-handler.submitTypeform \
    --zip-file fileb://lambda-package.zip \
    --timeout 30 \
    --environment Variables="{DYNAMODB_TABLE=$SERVICE_NAME-dynamodb,FROM_EMAIL=info@c3ops.io}"

# Create get function
aws lambda create-function \
    --region $REGION \
    --function-name "$SERVICE_NAME-get" \
    --runtime nodejs18.x \
    --role $ROLE_ARN \
    --handler typeform-handler.getSubmissions \
    --zip-file fileb://lambda-package.zip \
    --timeout 30 \
    --environment Variables="{DYNAMODB_TABLE=$SERVICE_NAME-dynamodb,FROM_EMAIL=info@c3ops.io}"

echo "✅ Lambda functions created"

# Step 4: Verify email for SES
echo "Setting up SES email verification..."
aws ses verify-email-identity \
    --region $REGION \
    --email-address info@c3ops.io

echo "📧 Email verification sent to info@c3ops.io"

# Clean up
rm -f /tmp/trust-policy.json /tmp/lambda-policy.json lambda-package.zip

echo ""
echo "🎉 Basic infrastructure deployed!"
echo ""
echo "📋 Resources Created:"
echo "• DynamoDB Table: $SERVICE_NAME-dynamodb"
echo "• Lambda Functions: $SERVICE_NAME-submit, $SERVICE_NAME-get"
echo "• IAM Role: $SERVICE_NAME-lambda-role"
echo ""
echo "⚠️  Next Steps:"
echo "1. Check info@c3ops.io inbox and verify the email address"
echo "2. Create API Gateway manually or use serverless framework:"
echo "   serverless deploy --stage prod"
echo ""
echo "📞 To test Lambda functions:"
echo "aws lambda invoke --region $REGION --function-name $SERVICE_NAME-submit --payload '{}' /tmp/response.json"