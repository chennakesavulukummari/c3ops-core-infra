# Deploy Typeform Email Fix

## What Was Fixed
The typeform Lambda function now uses constants for email addresses to ensure `info@c3ops.io` is always used.

**Changes Made**:
- ✅ Line 11: Added `ADMIN_EMAIL` constant 
- ✅ Line 230: Updated to use `ADMIN_EMAIL` constant instead of reading from env var

## Step 1: Build Lambda Package

```bash
cd /Users/ck/c3ops-repos/c3ops-website/lambda

# Install dependencies
npm install

# Create deployment package
zip -r typeform-handler.zip typeform-handler.js node_modules/
```

## Step 2: Deploy to AWS

### Option A: Using AWS CLI

```bash
# Set your AWS region
export AWS_REGION=ap-south-2

# Find your typeform function name
aws lambda list-functions --region $AWS_REGION --query 'Functions[?contains(FunctionName, `typeform`)].FunctionName' --output text

# Deploy (replace FUNCTION_NAME with your actual function)
aws lambda update-function-code \
  --function-name c3ops-website-typeform-submit \
  --region $AWS_REGION \
  --zip-file fileb://typeform-handler.zip

# Update environment variables
aws lambda update-function-configuration \
  --function-name c3ops-website-typeform-submit \
  --region $AWS_REGION \
  --environment Variables='{
    FROM_EMAIL=info@c3ops.io,
    ADMIN_EMAIL=info@c3ops.io,
    DYNAMODB_TABLE=c3ops-website-typeform-dynamodb
  }'
```

### Option B: Using SAM CLI

```bash
cd /Users/ck/c3ops-repos/c3ops-website

# Build
sam build

# Deploy
sam deploy \
  --stack-name c3ops-typeform \
  --parameter-overrides \
    FromEmail=info@c3ops.io \
    AdminEmail=info@c3ops.io \
  --capabilities CAPABILITY_IAM
```

### Option C: Using AWS Console

1. Go to AWS Lambda → Find typeform function
2. Upload new code: **Upload from → .zip file** → Select `typeform-handler.zip`
3. Update Environment variables:
   - `FROM_EMAIL` = `info@c3ops.io`
   - `ADMIN_EMAIL` = `info@c3ops.io`
   - Keep `DYNAMODB_TABLE` value as is
4. Click **Deploy**

## Step 3: Test the Fix

1. Go to https://www.c3ops.io
2. Click one of: "Schedule Assessment" | "Start Free Trial" | "Contact Sales" | "Request Demo"
3. Fill the Typeform with test data
4. Submit
5. Check **info@c3ops.io** inbox for:
   - Confirmation email to user
   - Internal notification to admin

## Verification Checklist

- [ ] Form submits without errors
- [ ] User receives confirmation email
- [ ] Admin receives notification email  
- [ ] All emails go to **info@c3ops.io** (not info@c3ops.in)
- [ ] DynamoDB records submitted form data
- [ ] No 500 errors in CloudWatch logs

## CloudWatch Logs

To check if deployment was successful:

```bash
aws logs tail /aws/lambda/c3ops-website-typeform-submit --follow --region ap-south-2
```

Look for:
- ✅ "Email sent successfully"
- ❌ "Failed to send email"

## Rollback (if needed)

```bash
# Redeploy previous version
aws lambda update-function-code \
  --function-name c3ops-website-typeform-submit \
  --region ap-south-2 \
  --s3-bucket BACKUP_BUCKET \
  --s3-key previous-typeform-handler.zip
```
