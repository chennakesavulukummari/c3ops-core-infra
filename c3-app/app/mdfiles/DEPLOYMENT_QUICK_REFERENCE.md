# 🚀 Lambda Deployment Quick Reference

## One-Liner Deployment

```bash
cd /Users/ck/Documents/FinOps DrivenDevOps && sam build && sam deploy --guided
```

## File Locations

| File | Purpose | Status |
|------|---------|--------|
| `lambda/index.js` | Lambda handler (S3 + SES) | ✅ Created |
| `sam-template.yaml` | Infrastructure as Code | ✅ Created |
| `lambda/package.json` | Dependencies | ✅ Updated |
| `src/services/emailService.js` | Frontend API client | ✅ Updated |
| `LAMBDA_DEPLOYMENT.md` | Full deployment guide | ✅ Created |
| `SERVERLESS_BACKEND_SUMMARY.md` | Overview & checklist | ✅ Created |

## What Happens When User Submits Form

```
1. React form → emailService.js
2. emailService.js → API Gateway
3. API Gateway → Lambda function
4. Lambda:
   a. Validates input
   b. Stores JSON in S3
   c. Sends confirmation email (SES)
   d. Sends admin notification (SES)
5. Returns success + request ID
6. React shows success message
```

## Architecture

```
AWS Lambda (Node.js)
    ├── Input Validation
    ├── S3: demo-requests/YYYY/MM/UUID.json
    ├── SES: User confirmation email
    └── SES: Admin notification
    
Connected via:
├── API Gateway (REST endpoint)
├── IAM Role (permissions)
└── CloudWatch (logging)
```

## Pre-Deployment Checklist

- [ ] AWS CLI installed: `aws --version`
- [ ] SAM CLI installed: `sam --version`
- [ ] Node.js 18+: `node --version`
- [ ] AWS credentials configured: `aws sts get-caller-identity`
- [ ] SES email verified: `aws ses list-verified-email-addresses`

```bash
# Quick check all prerequisites
aws --version && sam --version && node --version && \
aws sts get-caller-identity && \
aws ses list-verified-email-addresses
```

## Deploy Steps

### Step 1: Build
```bash
cd /Users/ck/Documents/FinOps DrivenDevOps
sam build
```

### Step 2: Deploy
```bash
sam deploy --guided
# Or non-interactive:
sam deploy --stack-name c3ops-demo-requests --capabilities CAPABILITY_NAMED_IAM
```

### Step 3: Get Endpoint
```bash
aws cloudformation describe-stacks \
  --stack-name c3ops-demo-requests \
  --query 'Stacks[0].Outputs[0].OutputValue' \
  --output text
```

### Step 4: Update .env
```env
VITE_API_ENDPOINT=https://YOUR_ENDPOINT/demo-requests
```

### Step 5: Redeploy Frontend
```bash
npm run build
aws s3 sync dist/ s3://your-bucket --delete
```

## Testing

### Local Test
```bash
bash test-lambda-local.sh
```

### Remote Test
```bash
curl -X POST https://YOUR_ENDPOINT/demo-requests \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "user@example.com",
    "company": "Test Co",
    "message": "Test message"
  }'
```

### Check S3 Stored Requests
```bash
aws s3 ls s3://c3ops-demo-requests-*/demo-requests/ --recursive
```

### View Lambda Logs
```bash
sam logs -n DemoRequestsFunction --stack-name c3ops-demo-requests --tail
```

## Lambda Response Codes

| Code | Meaning |
|------|---------|
| 200 | ✅ Success - request stored & emails sent |
| 400 | ❌ Invalid input (missing fields, bad email) |
| 500 | ❌ Server error (S3/SES issue) |

## Data Structure Stored in S3

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Acme Corp",
  "message": "Interested in demo",
  "requestedAt": "2025-01-13T10:30:45.123Z",
  "status": "pending"
}
```

**Location**: `s3://c3ops-demo-requests-ACCOUNT-REGION/demo-requests/2025/01/UUID.json`

## Troubleshooting

| Issue | Solution |
|-------|----------|
| SES Email Not Authorized | `aws ses verify-email-identity --email-address info@c3ops.io` |
| Lambda Timeout | Increase timeout in `sam-template.yaml` Globals |
| CORS Error | Check browser console for exact error |
| Permission Denied | Check IAM role has S3 & SES permissions |
| No emails received | Check SES sandbox mode (request production access) |

## Useful Commands

```bash
# List all resources in stack
aws cloudformation list-stack-resources --stack-name c3ops-demo-requests

# Delete stack (deletes everything)
aws cloudformation delete-stack --stack-name c3ops-demo-requests

# View stack events
aws cloudformation describe-stack-events --stack-name c3ops-demo-requests

# Check SES quota
aws ses get-account-sending-enabled

# List S3 buckets created
aws s3 ls | grep c3ops

# Get Lambda function info
aws lambda get-function --function-name c3ops-demo-requests-dev
```

## Cost

| Service | Monthly Cost |
|---------|-------------|
| Lambda | $0.20 |
| API Gateway | $3.50 |
| S3 | $0.23 |
| SES | FREE (up to 62k) |
| **TOTAL** | **~$4/month** |

(First free tier requests/month apply)

## Support Resources

- Deployment Guide: `LAMBDA_DEPLOYMENT.md`
- Architecture Summary: `SERVERLESS_BACKEND_SUMMARY.md`
- Lambda Code: `lambda/index.js`
- Infrastructure: `sam-template.yaml`
- Frontend Service: `src/services/emailService.js`

---

**Ready to deploy?** Run:
```bash
cd /Users/ck/Documents/FinOps DrivenDevOps && sam build && sam deploy --guided
```

For details, see `LAMBDA_DEPLOYMENT.md`
