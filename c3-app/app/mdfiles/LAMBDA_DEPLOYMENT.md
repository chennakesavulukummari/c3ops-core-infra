# Lambda + API Gateway + S3 + SES Deployment Guide

This guide explains how to deploy the serverless backend for the C3Ops FinOps Platform.

## Architecture Overview

```
Frontend (React/Vite)
    ↓
API Gateway (REST)
    ↓
Lambda Function
    ├─→ S3 Bucket (stores demo requests as JSON)
    ├─→ SES (sends confirmation emails to users)
    └─→ SES (sends admin notifications)
```

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** installed and configured: `aws --version`
3. **AWS SAM CLI** installed: `sam --version`
4. **SES verified email addresses** (in AWS Console):
   - Admin email: `info@c3ops.io`
   - Any user domain emails you want to accept
5. **Node.js 18+** for local testing

## Step 1: Verify SES Emails

Before deployment, verify your sender emails in AWS SES:

```bash
# List verified identities
aws ses list-verified-email-addresses

# If not verified, verify now (you'll receive confirmation emails)
aws ses verify-email-identity --email-address info@c3ops.io
```

**Note**: In SES sandbox mode, you can only send to verified addresses. For production, request production access from AWS.

## Step 2: Install Lambda Dependencies

```bash
cd lambda
npm install
cd ..
```

This installs:
- `aws-sdk` - AWS services (S3, SES)
- `uuid` - Generate unique demo request IDs

## Step 3: Deploy with SAM

### Option A: Interactive Guided Deployment (Recommended for first-time)

```bash
sam build
sam deploy --guided
```

When prompted:
- **Stack Name**: `c3ops-demo-requests` (or your choice)
- **AWS Region**: `us-east-1` (or your preferred region)
- **Environment**: `dev` (or `staging`/`prod`)
- **AdminEmail**: `info@c3ops.io`
- **FromEmail**: `info@c3ops.io`
- **Confirm changes before deploy**: `Y`
- **Allow SAM CLI to create IAM roles**: `Y`

### Option B: Direct Deployment

```bash
sam build
sam deploy \
  --stack-name c3ops-demo-requests \
  --region us-east-1 \
  --parameter-overrides \
    Environment=dev \
    AdminEmail=info@c3ops.io \
    FromEmail=info@c3ops.io \
  --capabilities CAPABILITY_NAMED_IAM
```

### Option C: Using AWS CloudFormation Directly

```bash
aws cloudformation create-stack \
  --stack-name c3ops-demo-requests \
  --template-body file://sam-template.yaml \
  --parameters \
    ParameterKey=Environment,ParameterValue=dev \
    ParameterKey=AdminEmail,ParameterValue=info@c3ops.io \
    ParameterKey=FromEmail,ParameterValue=info@c3ops.io \
  --capabilities CAPABILITY_NAMED_IAM \
  --region us-east-1
```

## Step 4: Get API Endpoint

After deployment, retrieve your API Gateway endpoint:

```bash
# Get stack outputs
aws cloudformation describe-stacks \
  --stack-name c3ops-demo-requests \
  --region us-east-1 \
  --query 'Stacks[0].Outputs'
```

You'll see output like:
```
[
  {
    "OutputKey": "ApiEndpoint",
    "OutputValue": "https://abc123def.execute-api.us-east-1.amazonaws.com/dev"
  },
  ...
]
```

**Save this endpoint** - you'll need it for frontend configuration.

## Step 5: Update Frontend Configuration

Update `.env` file in your frontend project:

```env
# For Lambda API Gateway deployment
VITE_API_ENDPOINT=https://abc123def.execute-api.us-east-1.amazonaws.com/dev

# Fallback for local backend (if needed)
VITE_API_URL=http://localhost:3001
```

Rebuild and redeploy your frontend to S3:

```bash
npm run build
aws s3 sync dist/ s3://your-bucket-name --delete
```

## Step 6: Test the Deployment

### Test with cURL

```bash
curl -X POST https://abc123def.execute-api.us-east-1.amazonaws.com/dev/demo-requests \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@verified-email.com",
    "company": "Acme Corp",
    "message": "Interested in seeing the platform"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Demo request received successfully! Check your email for confirmation.",
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "s3Location": "s3://c3ops-demo-requests-123456789-us-east-1/demo-requests/2025/01/550e8400-e29b-41d4-a716-446655440000.json"
}
```

### Check S3 for stored requests

```bash
# List demo requests
aws s3 ls s3://c3ops-demo-requests-123456789-us-east-1/demo-requests/ --recursive

# View a specific request
aws s3 cp s3://c3ops-demo-requests-123456789-us-east-1/demo-requests/2025/01/request-id.json -
```

### Check SES sending quota

```bash
aws ses get-account-sending-enabled
aws ses get-send-statistics
```

## Step 7: Monitor & Logs

View Lambda logs:

```bash
# Real-time logs
sam logs -n DemoRequestsFunction --stack-name c3ops-demo-requests --tail

# Or use CloudWatch directly
aws logs tail /aws/lambda/c3ops-demo-requests-dev --follow
```

Check CloudWatch metrics:

```bash
aws cloudwatch list-metrics --namespace AWS/Lambda \
  --dimensions Name=FunctionName,Value=c3ops-demo-requests-dev
```

## Troubleshooting

### Issue: "SES Email Not Authorized"
**Solution**: Verify the sender email in SES or request production access.

```bash
aws ses verify-email-identity --email-address info@c3ops.io
```

### Issue: "Access Denied" for S3
**Solution**: Check Lambda IAM role has S3 permissions (template includes this).

```bash
aws iam get-role-policy \
  --role-name c3ops-demo-requests-lambda-role-dev \
  --policy-name S3Access
```

### Issue: CORS errors from frontend
**Solution**: The template includes CORS headers. Check API Gateway logs:

```bash
aws apigateway get-stage \
  --rest-api-id abc123 \
  --stage-name dev
```

### Issue: Lambda timeout
**Solution**: Increase timeout in template (currently 30 seconds):

```yaml
Globals:
  Function:
    Timeout: 60  # Increase from 30
```

## Production Deployment

For production, update parameters:

```bash
sam deploy \
  --stack-name c3ops-demo-requests-prod \
  --region us-east-1 \
  --parameter-overrides \
    Environment=prod \
    AdminEmail=operations@c3ops.io \
    FromEmail=noreply@c3ops.io \
  --capabilities CAPABILITY_NAMED_IAM
```

Also:
1. Request SES production access for higher sending limits
2. Enable API Gateway throttling/usage plans for security
3. Add AWS WAF for DDoS protection
4. Enable Lambda function versioning and aliases
5. Set up CloudWatch alarms for errors

## Cleanup

To delete all resources:

```bash
aws cloudformation delete-stack \
  --stack-name c3ops-demo-requests \
  --region us-east-1

# Monitor deletion
aws cloudformation wait stack-delete-complete \
  --stack-name c3ops-demo-requests \
  --region us-east-1
```

## File Structure

```
├── lambda/
│   ├── index.js           # Lambda handler function
│   └── package.json       # Dependencies
├── sam-template.yaml      # Infrastructure as Code (IaC)
├── .env                   # Frontend environment variables
└── LAMBDA_DEPLOYMENT.md   # This guide
```

## References

- [AWS SAM Documentation](https://docs.aws.amazon.com/serverless-application-model/)
- [Lambda + API Gateway Integration](https://docs.aws.amazon.com/lambda/latest/dg/api-gateway-integration.html)
- [SES Best Practices](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/best-practices-enforce-tls.html)
- [S3 Best Practices](https://docs.aws.amazon.com/AmazonS3/latest/userguide/BestPractices.html)

## Support

For issues or questions:
- Check Lambda logs: `sam logs`
- Review CloudWatch metrics
- Contact AWS Support for infrastructure issues
- Email: info@c3ops.io
