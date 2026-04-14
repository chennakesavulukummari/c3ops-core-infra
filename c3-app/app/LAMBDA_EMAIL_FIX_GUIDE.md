# Fix Lambda Email Configuration - Manual Steps

## Problem
Email submissions are going to `info@c3ops.in` instead of `info@c3ops.io`. This is because the Lambda function's environment variables have the wrong email address set.

## Solution

### Option 1: Using AWS CLI (Automated)

1. **Run the fix script:**
```bash
chmod +x fix-lambda-email.sh
./fix-lambda-email.sh
```

This script will:
- Find all Lambda functions in your AWS account
- Update `GMAIL_TO_EMAIL` environment variable to `info@c3ops.io`
- Update `SES_ADMIN_EMAIL` environment variable to `info@c3ops.io`

### Option 2: Manual Fix via AWS Console

1. **Go to AWS Lambda Console:**
   - Navigate to https://console.aws.amazon.com/lambda
   - Look for your function (likely named `c3ops-*` or similar)

2. **Update Environment Variables:**
   - Click on the function name
   - Scroll down to "Environment variables" section
   - Look for these variables:
     - `GMAIL_TO_EMAIL`
     - `SES_ADMIN_EMAIL`
     - `FROM_EMAIL`
     - `SES_FROM_EMAIL`
   
3. **Edit Each Variable:**
   - Click "Edit" next to Environment variables
   - Find variables containing `info@c3ops.in`
   - Change to `info@c3ops.io`
   - Click "Save"

4. **Verify the Change:**
   - The function will be deployed automatically
   - Test by submitting a demo request
   - Verify the email goes to `info@c3ops.io`

### Option 3: Using AWS CLI Manually

```bash
# List all Lambda functions
aws lambda list-functions --query 'Functions[].FunctionName' --output text

# For each function, update the environment variables
# Replace FUNCTION_NAME with your Lambda function name
aws lambda update-function-configuration \
  --function-name FUNCTION_NAME \
  --environment Variables="{GMAIL_TO_EMAIL=info@c3ops.io,SES_ADMIN_EMAIL=info@c3ops.io}"
```

## Verify the Fix

1. **Check Lambda Configuration:**
```bash
aws lambda get-function-configuration --function-name YOUR_FUNCTION_NAME \
  --query 'Environment.Variables' --output json | grep -E "GMAIL_TO_EMAIL|SES_ADMIN_EMAIL"
```

2. **Test Email Submission:**
   - Go to https://www.c3ops.io
   - Submit a demo request form
   - Check email inbox for `info@c3ops.io` inbox
   - Verify the submission went to correct email

## Common Lambda Function Names

Look for functions with these names (adjust based on your setup):
- `c3ops-email-api`
- `c3ops-email-api-dev`
- `c3ops-demo-requests-dev`
- `c3ops-demo-requests-prod`
- `c3ops-website-typeform-*`
- Any function matching pattern `*email*` or `*demo*`

## Additional Notes

- The change takes effect immediately
- No need to redeploy from code
- All new form submissions will go to the correct email
- Check both `GMAIL_TO_EMAIL` and `SES_ADMIN_EMAIL` - both should be `info@c3ops.io`
