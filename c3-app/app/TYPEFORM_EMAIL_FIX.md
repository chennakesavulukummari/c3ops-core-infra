# Fix Typeform Email Issue - info@c3ops.in → info@c3ops.io

## The Problem
The Typeform modal on the website sends internal emails to `info@c3ops.in` instead of `info@c3ops.io`.

**Root Cause**: Lambda environment variables are incorrectly set.

## Code Details

**File**: `lambda/typeform-handler.js` (Line 230)
```javascript
const adminEmail = process.env.ADMIN_EMAIL || 'info@c3ops.io';
```

The Lambda has these environment variables set incorrectly:
- `ADMIN_EMAIL` = `info@c3ops.in` (should be `info@c3ops.io`)
- `FROM_EMAIL` = `info@c3ops.in` (should be `info@c3ops.io`)

## Quick Fix - AWS CLI Command

Replace `FUNCTION_NAME` with your actual Lambda function name and run:

```bash
# First, find your typeform function
aws lambda list-functions --region ap-south-2 --query 'Functions[?contains(FunctionName, `typeform`)].FunctionName' --output text

# Then update it (example function name: c3ops-website-typeform-submit)
aws lambda update-function-configuration \
  --function-name c3ops-website-typeform-submit \
  --region ap-south-2 \
  --environment Variables='{FROM_EMAIL=info@c3ops.io,ADMIN_EMAIL=info@c3ops.io,DYNAMODB_TABLE=YOUR_TABLE_NAME}'
```

## Manual Fix via AWS Console

1. Go to **AWS Lambda Console** → https://console.aws.amazon.com/lambda
2. Filter by region: **ap-south-2**
3. Find function containing "typeform"
4. Click on the function → scroll to **Environment variables**
5. Click **Edit**
6. Update these variables:
   - `ADMIN_EMAIL` → `info@c3ops.io`
   - `FROM_EMAIL` → `info@c3ops.io`
7. Click **Save**

## Verify the Fix

1. Submit a form on https://www.c3ops.io (any of these actions):
   - Demo Request
   - Free Assessment
   - Free Trial
   - Contact Sales

2. Check the inbox of **info@c3ops.io** for:
   - ✅ Confirmation email to the user
   - ✅ Internal notification email to admin

3. Verify emails are no longer going to `info@c3ops.in`

## Additional Email Variables to Check

While you're updating, also verify these in the Lambda console:

| Variable | Should Be | Current |
|----------|-----------|---------|
| FROM_EMAIL | info@c3ops.io | ? |
| ADMIN_EMAIL | info@c3ops.io | ? |
| GMAIL_TO_EMAIL | info@c3ops.io | ? |
| SES_ADMIN_EMAIL | info@c3ops.io | ? |

## Code Review - What We Found

The typeform-handler.js has:
- **Line 11**: `const FROM_EMAIL = process.env.FROM_EMAIL || 'info@c3ops.io';`
- **Line 230**: `const adminEmail = process.env.ADMIN_EMAIL || 'info@c3ops.io';`

Both default to correct email, but the actual deployed Lambda env vars are wrong.

## Related Functions

The same issue might exist in other Lambda functions:
- `c3ops-email-api` 
- `c3ops-demo-requests-*`

Check and update all of them with the same email addresses.
