# Form Submission Implementation Guide
**C3Ops FinOps Platform - TypeForm Integration with AWS**

**Last Updated:** March 27, 2026  
**Status:** ✅ COMPLETE - Ready for Deployment

---

## 📋 Architecture Overview

The form submission system captures user data from the modal (assessment, trial, contact requests) and integrates with:

- **API Gateway**: REST endpoint for form submissions
- **Lambda**: Process form data, validate, and trigger emails
- **DynamoDB**: Store form submissions for admin review
- **SES**: Send confirmation and internal notification emails

```
React Form Modal
    ↓
API Gateway (POST /api/typeform/submit)
    ↓
Lambda (typeform-handler.submitTypeform)
    ├→ DynamoDB PutItem (store submission)
    ├→ SES SendEmail (user confirmation)
    └→ SES SendEmail (internal notification)
```

---

## 🔧 Current Implementation Status

### ✅ Frontend (React)
- **Component**: `src/components/common/TypeformModal.jsx`
- **Form Fields Captured**:
  - Full Name (required)
  - Work Email (required)
  - Company Name (required)
  - Role (required)
  - Monthly Cloud Spend (required)
  - Cloud Providers (required)
  - Primary Goal (required)
  - Timeline (required)
  - Phone (optional)
  - Message (optional)

- **Action Types**: `assessment`, `trial`, `contact`
- **API Endpoint**: `https://3tz75do8r6.execute-api.ap-south-2.amazonaws.com/prod/api/typeform/submit`

### ✅ Backend (AWS Lambda)
- **Handler**: `lambda/typeform-handler.js`
- **Function**: `typeform-handler.submitTypeform`
- **Dependencies**:
  - `@aws-sdk/client-dynamodb` - DynamoDB client
  - `@aws-sdk/client-ses` - SES email client
  - `@aws-sdk/lib-dynamodb` - High-level DynamoDB operations
  - `aws-sdk` - Legacy SDK (v2)
  - `uuid` - ID generation

### ✅ Database (DynamoDB)
- **Table**: `c3ops-typeform-dynamodb`
- **Primary Key**: `id` (hash) + `timestamp` (range)
- **Global Secondary Index**: `EmailIndex` (for querying by email)
- **Stored Fields**:
  ```
  {
    id: "assessment_user@company.com_1234567890",
    email: "user@company.com",
    name: "John Doe",
    company: "Acme Corp",
    actionType: "assessment",
    role: "Cloud Architect",
    monthlyCloudSpend: "$50K - $200K",
    cloudProviders: ["AWS", "Azure"],
    primaryGoal: "Reduce cloud costs by 20-30%",
    timeline: "Immediate (0-3 months)",
    phone: "+1-555-0123",
    message: "Optional message",
    submittedAt: "2026-03-27T10:30:00.000Z",
    status: "new",
    source: "website_typeform",
    userAgent: "Mozilla/5.0...",
    ip: "203.0.113.45"
  }
  ```

### ✅ Email (SES)
- **Configuration Set**: `c3ops-config-set`
- **Sender Email**: Configurable via `FROM_EMAIL` env var
- **Email Types**:
  1. **User Confirmation Email**: Action-specific next steps
  2. **Internal Notification**: Sales/admin team alert with lead priority

### ✅ API Gateway
- **Route**: `POST /api/typeform/submit`
- **CORS**: Enabled for localhost and production domain
- **Integration**: Lambda proxy integration
- **Response Format**: JSON

---

## 🚀 Deployment Steps

### 1. **Install Lambda Dependencies**
```bash
cd /Users/ck/c3ops-repos/c3ops-website/lambda
npm install
```

### 2. **Deploy Infrastructure with Terraform**
```bash
cd /Users/ck/c3ops-repos/c3ops-website/terraform

# Review changes
terraform plan

# Apply infrastructure
terraform apply

# Save outputs
terraform output > deployment_outputs.txt
```

### 3. **Verify SES Email Identity**
Before sending emails, you must verify the sender email in AWS SES:

```bash
# Verify sender email (one-time setup)
aws ses verify-email-identity \
  --email-address info@c3ops.io \
  --region ap-south-2

# Check verification status
aws ses get-account-sending-enabled --region ap-south-2

# Check verified identities
aws ses list-verified-email-addresses --region ap-south-2
```

**Important**: Check your email and click the verification link from AWS.

### 4. **Update Lambda Environment Variables**
In Terraform `terraform/lambda.tf`, set these environment variables:

```hcl
environment {
  variables = {
    ENVIRONMENT        = var.environment
    DYNAMODB_TABLE     = aws_dynamodb_table.typeform_submissions.name
    FROM_EMAIL         = "info@c3ops.io"  # Verified email
  }
}
```

### 5. **Deploy Lambda Functions**
```bash
# Build Lambda function code
cd /Users/ck/c3ops-repos/c3ops-website
zip -r lambda/typeform-handler.zip lambda/typeform-handler.js node_modules

# Update Lambda function code
aws lambda update-function-code \
  --function-name c3ops-typeform-submit \
  --zip-file fileb://lambda/typeform-handler.zip \
  --region ap-south-2
```

### 6. **Test the Form Submission**
```bash
# Test with sample data
curl -X POST https://3tz75do8r6.execute-api.ap-south-2.amazonaws.com/prod/api/typeform/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "company": "Test Company",
    "actionType": "assessment",
    "role": "Cloud Architect",
    "monthlyCloudSpend": "$50K - $200K",
    "cloudProviders": ["AWS", "Azure"],
    "primaryGoal": "Reduce cloud costs by 20-30%",
    "timeline": "Immediate"
  }'
```

---

## 📊 Monitoring & Admin Dashboard

### Check Submissions in DynamoDB
```bash
# List all submissions
aws dynamodb scan \
  --table-name c3ops-typeform-dynamodb \
  --region ap-south-2 \
  --limit 10

# Query by email
aws dynamodb query \
  --table-name c3ops-typeform-dynamodb \
  --index-name EmailIndex \
  --key-condition-expression "email = :email" \
  --expression-attribute-values '{":email":{"S":"user@company.com"}}' \
  --region ap-south-2
```

### Admin Dashboard
Access submitted forms at: `src/components/features/AdminDashboard.jsx`

The dashboard provides:
- Real-time submission count
- Filter by action type (assessment, trial, contact)
- Filter by status (new, contacted, qualified, lost)
- Download submissions as CSV
- View detailed lead information

### SES Monitoring
```bash
# Check SES send statistics
aws ses get-send-statistics --region ap-south-2

# Check SES quota
aws ses get-send-quota --region ap-south-2
```

---

## 🔐 Security & Best Practices

### ✅ Already Implemented
1. **Input Validation**: Required fields checked on frontend and backend
2. **Email Validation**: Regex validation for email format
3. **CORS Configuration**: Only allows specific origins
4. **IAM Policies**: Lambda has minimal permissions (DynamoDB + SES only)
5. **Error Handling**: Graceful error responses without exposing internal details
6. **CloudWatch Logging**: All operations logged for audit trail
7. **HTTPS/TLS**: All API communications encrypted

### 🔄 Recommendations
1. **Use AWS Secrets Manager** for SES credentials (not env vars)
   ```hcl
   # In Terraform
   resource "aws_secretsmanager_secret" "ses_creds" {
     name = "c3ops/ses-credentials"
   }
   ```

2. **Enable DynamoDB Point-in-Time Recovery** (already configured)

3. **Set up SNS Alarms** for SES bounce/complaint rates
   ```bash
   # Check bounce rate
   aws cloudwatch get-metric-statistics \
     --namespace AWS/SES \
     --metric-name Bounce \
     --dimensions Name=ConfigurationSet,Value=c3ops-config-set \
     --start-time 2026-03-20T00:00:00Z \
     --end-time 2026-03-27T23:59:59Z \
     --period 86400 \
     --statistics Sum
   ```

4. **Implement Rate Limiting** on API Gateway
5. **Use VPC Endpoints** for DynamoDB and SES

---

## 🧪 Testing Checklist

- [ ] Form submits successfully
- [ ] User receives confirmation email
- [ ] Admin receives notification email
- [ ] Data appears in DynamoDB
- [ ] Admin dashboard loads submissions
- [ ] Filter and search work in dashboard
- [ ] Error handling works (invalid email, missing fields)
- [ ] CORS works for production and localhost
- [ ] SES quota not exceeded
- [ ] CloudWatch logs show successful execution

---

## 🐛 Troubleshooting

### "Email not verified" Error
**Solution**: Verify the email in AWS SES console or CLI
```bash
aws ses verify-email-identity --email-address info@c3ops.io --region ap-south-2
```

### "DynamoDB: User is not authorized" Error
**Solution**: Update Lambda IAM role policy with DynamoDB permissions
```bash
# Check Lambda role permissions
aws iam get-role-policy --role-name c3ops-lambda-role --policy-name c3ops-lambda-dynamodb-ses
```

### Form submission returns 500 error
**Solution**: Check Lambda CloudWatch logs
```bash
# View recent logs
aws logs tail /aws/lambda/c3ops-typeform-submit --follow --region ap-south-2
```

### Emails not sending
1. Check SES is in production access (not sandbox)
2. Verify recipient email is verified if in sandbox mode
3. Check bounce/complaint rates: `aws ses get-send-quota --region ap-south-2`
4. Review SES event history in CloudWatch

---

## 📈 Performance Optimization

### Current Configuration
- **Lambda Memory**: 512 MB
- **Lambda Timeout**: 30 seconds
- **DynamoDB Billing**: On-demand
- **SES Batch Size**: 1 (can optimize later)

### Optimization Opportunities
1. **Batch SES Emails**: Send multiple emails in parallel
2. **Lambda Concurrency**: Increase for high-traffic periods
3. **DynamoDB TTL**: Auto-expire old submissions (optional)
4. **API Gateway Caching**: Cache health check responses

---

## 📝 API Response Examples

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

### Error Response (400)
```json
{
  "error": "Missing required fields: name, email, company, actionType"
}
```

### Error Response (500)
```json
{
  "error": "Internal server error",
  "message": "Error details here"
}
```

---

## 📞 Support & Contact

- **Email**: info@c3ops.io
- **Slack**: #devops-platform
- **Documentation**: See `/mdfiles/` folder
- **AWS Region**: ap-south-2
- **API Gateway ID**: `3tz75do8r6`

---

## 🔗 Related Documentation

- [AWS SES Setup Guide](./AWS_SES_SETUP_GUIDE.md)
- [Terraform Deployment Guide](./TERRAFORM_DEPLOYMENT_GUIDE.md)
- [Lambda Deployment](./LAMBDA_DEPLOYMENT.md)
- [Email Implementation](./EMAIL_IMPLEMENTATION.md)
- [Backend Deployment](./BACKEND_DEPLOYMENT_GUIDE.md)

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2026-03-27 | 1.0 | Initial implementation - Complete API, Lambda, DynamoDB, SES integration |
| | | TypeForm modal fully functional with all form fields |
| | | Admin dashboard with submission management |
| | | Email templates for user and internal notifications |
