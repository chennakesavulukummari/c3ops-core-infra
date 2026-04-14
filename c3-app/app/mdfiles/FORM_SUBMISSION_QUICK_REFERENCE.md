# Form Submission - Quick Reference
**C3Ops FinOps Platform Integration**

## 🎯 What's Implemented

✅ **Complete End-to-End Form Submission System**

### Frontend (React)
- Multi-step form modal with 6 steps
- Captures: Name, Email, Company, Role, Cloud Spend, Cloud Providers, Goal, Timeline, Phone, Message
- 3 action types: Assessment, Trial, Contact
- Real-time validation
- Error handling with user feedback

### Backend (AWS)
- **API Gateway**: REST endpoint with CORS
- **Lambda**: Process form, save data, send emails
- **DynamoDB**: Store submissions with search capability
- **SES**: Send user confirmations & admin notifications

---

## 📍 Key Files

```
Frontend:
├── src/components/common/TypeformModal.jsx (Form Component)
├── src/services/emailService.js (API client)
└── src/components/features/AdminDashboard.jsx (View submissions)

Backend:
├── lambda/typeform-handler.js (Main handler)
├── lambda/package.json (Dependencies)
└── terraform/
    ├── lambda.tf (Lambda configuration)
    ├── api_gateway.tf (API routes)
    ├── dynamodb.tf (Database schema)
    └── ses.tf (Email service)

Documentation:
├── mdfiles/FORM_SUBMISSION_IMPLEMENTATION.md (Full guide)
└── verify-form-submission.sh (Verification script)
```

---

## 🚀 Quick Start

### 1. Verify AWS Setup
```bash
bash verify-form-submission.sh
```

### 2. Test Form Submission
```bash
curl -X POST https://3tz75do8r6.execute-api.ap-south-2.amazonaws.com/prod/api/typeform/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@company.com",
    "company": "Acme Corp",
    "actionType": "assessment",
    "role": "Cloud Architect",
    "monthlyCloudSpend": "$50K - $200K",
    "cloudProviders": ["AWS", "Azure"],
    "primaryGoal": "Reduce cloud costs by 20-30%",
    "timeline": "Immediate"
  }'
```

### 3. Check Submission
```bash
# View in DynamoDB
aws dynamodb scan --table-name c3ops-typeform-dynamodb --region ap-south-2

# View in Admin Dashboard
# Go to: http://localhost:5173/admin
```

---

## 📊 API Specification

### Endpoint
```
POST https://3tz75do8r6.execute-api.ap-south-2.amazonaws.com/prod/api/typeform/submit
```

### Request Payload
```json
{
  "name": "string (required)",
  "email": "string (required, email format)",
  "company": "string (required)",
  "actionType": "assessment|trial|contact (required)",
  "role": "string (optional)",
  "monthlyCloudSpend": "string (optional)",
  "cloudProviders": ["string"] (optional array),
  "primaryGoal": "string (optional)",
  "timeline": "string (optional)",
  "phone": "string (optional)",
  "message": "string (optional)"
}
```

### Success Response (201)
```json
{
  "success": true,
  "message": "Typeform submission stored and emails sent successfully",
  "id": "assessment_user@company.com_1711530600000",
  "emailStatus": {
    "userEmailSent": true,
    "internalEmailSent": true
  }
}
```

### Error Response (400/500)
```json
{
  "error": "Error message",
  "message": "Detailed error message"
}
```

---

## 📧 Email Flow

### User Gets
1. **Confirmation Email** - Action-specific next steps
   - Assessment: Mentions 30-minute call & cost report
   - Trial: Mentions free trial setup & credentials
   - Contact: Mentions sales team will reach out

2. **Sender**: info@c3ops.io
3. **Subject**: "Thank you for your interest in C3Ops FinOps Platform - [Action Type]"

### Admin Gets (info@c3ops.io)
1. **Notification Email** - Full lead details
2. **Lead Priority**: HIGH if spend > $200K, otherwise MEDIUM
3. **Subject**: "New [Action Type] Request - [Company] ([Name])"

---

## 🔄 Data Flow

```
User fills form in React
         ↓
TypeformModal captures data
         ↓
POST /api/typeform/submit
         ↓
API Gateway routes to Lambda
         ↓
Lambda validates input
         ↓
├→ DynamoDB: Stores submission
├→ SES: Sends user confirmation
└→ SES: Sends admin notification
         ↓
Returns success response (201)
         ↓
React shows success message
```

---

## 🧪 Testing

### Test Scenarios

1. **Happy Path**
   - All fields filled
   - Valid email format
   - Should return 201 with success=true

2. **Missing Required Fields**
   - Submit without name/email/company
   - Should return 400 with error message

3. **Invalid Email**
   - Submit with invalid email format
   - Should return 400 with error message

4. **Network Error**
   - Temporarily disconnect internet
   - React shows error toast notification

### Test Commands

```bash
# Send test submission
curl -X POST https://3tz75do8r6.execute-api.ap-south-2.amazonaws.com/prod/api/typeform/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "company": "Test Co",
    "actionType": "assessment"
  }'

# Check Lambda logs
aws logs tail /aws/lambda/c3ops-typeform-submit --follow

# Check DynamoDB for submission
aws dynamodb scan --table-name c3ops-typeform-dynamodb --limit 5

# Check SES stats
aws ses get-send-statistics --region ap-south-2
```

---

## 🔒 Security Notes

✅ **Already Configured**
- Email validation
- Required field validation
- CORS enabled for safe origins
- IAM policy for minimal Lambda permissions
- CloudWatch logging for audit trail
- HTTPS/TLS encryption

⚠️ **Consider**
- Rate limiting (prevent spam)
- CAPTCHA (bot prevention)
- Request signing (API authentication)
- VPC endpoints (network isolation)

---

## 📈 Monitoring

### CloudWatch Logs
```bash
# Real-time logs
aws logs tail /aws/lambda/c3ops-typeform-submit --follow

# Specific timestamp
aws logs filter-log-events \
  --log-group-name /aws/lambda/c3ops-typeform-submit \
  --start-time $(date -d '1 hour ago' +%s)000
```

### DynamoDB Metrics
```bash
# Scan count
aws dynamodb describe-table --table-name c3ops-typeform-dynamodb \
  --query 'Table.ItemCount'

# Consumed capacity
aws cloudwatch get-metric-statistics \
  --namespace AWS/DynamoDB \
  --metric-name ConsumedWriteCapacityUnits \
  --dimensions Name=TableName,Value=c3ops-typeform-dynamodb \
  --start-time 2026-03-20T00:00:00Z \
  --end-time 2026-03-27T23:59:59Z \
  --period 86400
```

### SES Metrics
```bash
# Send statistics
aws ses get-send-statistics --region ap-south-2

# Send quota
aws ses get-send-quota --region ap-south-2
```

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| "Email not verified" | Verify email in SES: `aws ses verify-email-identity --email-address info@c3ops.io` |
| "DynamoDB: User not authorized" | Check Lambda IAM role has DynamoDB permissions |
| Form submission 500 error | Check Lambda logs: `aws logs tail /aws/lambda/c3ops-typeform-submit` |
| Emails not received | Check SES quota, verify sender email, check bounce rate |
| CORS error in browser | Verify origin in API Gateway CORS config |

---

## 🔗 Related Resources

- [Full Implementation Guide](./FORM_SUBMISSION_IMPLEMENTATION.md)
- [AWS SES Setup](./AWS_SES_SETUP_GUIDE.md)
- [Lambda Deployment](./LAMBDA_DEPLOYMENT.md)
- [Terraform Guide](./TERRAFORM_DEPLOYMENT_GUIDE.md)
- [Admin Dashboard](../src/components/features/AdminDashboard.jsx)

---

## 📞 Support

For issues or questions:
1. Check CloudWatch logs
2. Review error response message
3. Consult implementation guide
4. Contact: info@c3ops.io

---

**Last Updated**: March 27, 2026  
**Status**: ✅ Production Ready
