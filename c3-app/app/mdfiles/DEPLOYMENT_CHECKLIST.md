# ✅ C3OPS.IO PRODUCTION DEPLOYMENT CHECKLIST

**Status**: ✅ READY FOR DEPLOYMENT  
**Date**: March 15, 2026  
**Primary Domain**: c3ops.io  
**AWS Account**: 318095823459  
**Region**: ap-south-2 (Hyderabad)  

---

## 📋 Pre-Deployment Checklist

### ✅ Completed Tasks

- [x] **Terraform Infrastructure Configuration**
  - Variables cleaned (removed redirect_domain, enable_redirect_bucket)
  - main.tf recreated with single S3 bucket for c3ops.io
  - Single CloudFront distribution for c3ops.io
  - Route53 records updated (no redirect records)
  - All files formatted and validated

- [x] **Code Quality**
  - Terraform validate: ✅ PASSED
  - Terraform fmt: ✅ FORMATTED
  - No syntax errors
  - No c3ops.io references in infrastructure code

- [x] **Documentation Updated**
  - DEPLOYMENT_COMPLETE.md: Resource count 19 → 17
  - C3OPS_TERRAFORM_SETUP.md: Domain strategy updated
  - terraform/README.md: Redirect references removed
  - INFRASTRUCTURE_UPDATED_SUMMARY.md: Created (new)

- [x] **File Cleanup**
  - Corrupted files deleted and recreated
  - All Terraform modules properly scoped
  - Naming conventions consistent (c3ops-io-website-*)

---

## 🚀 Deployment Steps

### Step 1: Prepare AWS Credentials
```bash
# Option A: Using provided credentials
export AWS_ACCESS_KEY_ID="YOUR_AWS_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="YOUR_AWS_SECRET_ACCESS_KEY"
export AWS_DEFAULT_REGION="ap-south-2"

# Option B: Using AWS CLI profile
aws configure --profile c3ops-io
# Enter: Access Key ID, Secret Access Key, Region (ap-south-2), Format (json)
```

### Step 2: Create ACM Certificate
The certificate MUST be in `us-east-1` (CloudFront requirement):
```bash
aws acm request-certificate \
  --domain-name c3ops.io \
  --subject-alternative-names "*.c3ops.io" \
  --region us-east-1 \
  --profile c3ops-io
```

**Wait for certificate validation** (check email for verification link)

Get the certificate ARN:
```bash
aws acm list-certificates --region us-east-1 --query 'CertificateSummaryList[0].CertificateArn' --profile c3ops-io
```

### Step 3: Configure Terraform Variables
```bash
cd terraform

cp terraform.tfvars.example terraform.tfvars

# Edit terraform.tfvars with your certificate ARN:
# certificate_arn = "arn:aws:acm:us-east-1:YOUR-AWS-ACCOUNT-ID:certificate/YOUR-CERT-ID"
nano terraform.tfvars
```

### Step 4: Initialize Terraform
```bash
terraform init

# Verify initialization
terraform validate
```

### Step 5: Plan Deployment
```bash
terraform plan -out=tfplan

# Review the plan carefully:
# - 1 S3 bucket (c3ops-io-website)
# - 1 CloudFront distribution
# - 1 API Gateway
# - 3 Lambda functions
# - 1 DynamoDB table
# - 4 Route53 records
# - IAM roles and policies
```

### Step 6: Deploy Infrastructure
```bash
terraform apply tfplan

# Wait for completion (5-10 minutes)
# CloudFront distribution propagation may take 5-15 minutes
```

### Step 7: Retrieve Outputs
```bash
terraform output

# You should see:
# - cloudfront_domain_name: d123abc456.cloudfront.net
# - cloudfront_distribution_id: E1A2B3C4D5E6F7G8H9
# - s3_bucket_name: c3ops-io-website-YOUR-AWS-ACCOUNT-ID
# - api_gateway_endpoint: https://abc123.execute-api.ap-south-2.amazonaws.com
# - website_url: https://c3ops.io
# - api_url: https://api.c3ops.io
# - dynamodb_table_name: c3ops-website-typeform-dynamodb
```

### Step 8: Configure Route53 (Manual)
Update your domain registrar to use Route53 nameservers:
```bash
# Get Route53 nameservers
aws route53 list-resource-record-sets \
  --hosted-zone-id Z1A2B3C4D5E6F7G \
  --query 'ResourceRecordSets[0]' \
  --profile c3ops-io
```

Log into your domain registrar and update nameservers to the Route53 ones.

### Step 9: Deploy Frontend Code
```bash
# Build React/Vite application
npm run build

# Get bucket name from Terraform output
BUCKET=$(terraform output -raw s3_bucket_name)
DIST_ID=$(terraform output -raw cloudfront_distribution_id)

# Upload to S3 (with cache headers)
aws s3 sync dist/ s3://$BUCKET/ \
  --delete \
  --profile c3ops-io \
  --cache-control "public, max-age=3600"

# Upload index.html with no-cache (for SPA routing)
aws s3 cp dist/index.html s3://$BUCKET/index.html \
  --profile c3ops-io \
  --cache-control "public, max-age=0, must-revalidate"

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id $DIST_ID \
  --paths "/*" \
  --profile c3ops-io
```

### Step 10: Verify Deployment
```bash
# Test website accessibility
curl -I https://c3ops.io

# Test API endpoint
curl https://api.c3ops.io/api/health

# Check CloudFront status
aws cloudfront get-distribution \
  --id $DIST_ID \
  --query 'Distribution.Status' \
  --profile c3ops-io
```

---

## 🔍 Verification Checklist

After deployment, verify:

- [ ] `https://c3ops.io` loads successfully
- [ ] `https://www.c3ops.io` works (should redirect or show content)
- [ ] `https://api.c3ops.io/api/health` returns 200 OK
- [ ] CloudFront certificate shows as valid (no warnings)
- [ ] S3 bucket is not publicly accessible
- [ ] Lambda functions are in the AWS console
- [ ] DynamoDB table exists with data
- [ ] CloudWatch logs show function executions
- [ ] Route53 health check is passing
- [ ] No errors in CloudWatch Logs

---

## 📊 Post-Deployment Configuration

### Configure Lambda Functions
Update the Lambda environment variables in AWS Console or via AWS CLI:

```bash
# For demo-request function
aws lambda update-function-configuration \
  --function-name c3ops-website-demo-request \
  --environment Variables="{SES_FROM_EMAIL=info@c3ops.io,...}" \
  --region ap-south-2 \
  --profile c3ops-io
```

### Configure DynamoDB
- Table already created with:
  - PITR: ✅ Enabled
  - Encryption: ✅ Enabled
  - Billing: Pay per request
  - GSI: EmailIndex for queries

### Configure CloudWatch Alarms
- DynamoDB throttling alarm already created
- Review in AWS Console: CloudWatch → Alarms

### Configure API Gateway Logging
Update API Gateway to log to CloudWatch (optional but recommended):
```bash
# In AWS Console: API Gateway → Select API → Logs → Enable logging
```

---

## 🔐 Security Verification

- [ ] S3 bucket public access is blocked
- [ ] CloudFront uses HTTPS (TLS 1.2+)
- [ ] Origin Access Identity (OAI) is configured
- [ ] IAM roles follow least-privilege principle
- [ ] DynamoDB encryption is enabled
- [ ] CloudWatch logs are retained (30 days default)
- [ ] No hardcoded secrets in code
- [ ] API keys/credentials in AWS Secrets Manager (if needed)

---

## 🚨 Important Notes

### DO NOT DO THIS
- ❌ Commit `terraform.tfvars` to Git
- ❌ Share AWS credentials publicly
- ❌ Use same certificate for multiple domains without adding SANs
- ❌ Delete S3 bucket or DynamoDB table manually
- ❌ Modify CloudFront distribution manually (use Terraform)

### IF SOMETHING GOES WRONG

**CloudFront not showing new content:**
```bash
# Invalidate cache
aws cloudfront create-invalidation --distribution-id DIST_ID --paths "/*" --profile c3ops-io
```

**Lambda function errors:**
```bash
# Check logs
aws logs tail /aws/lambda/c3ops-website-health-check --follow --profile c3ops-io
```

**DynamoDB table errors:**
```bash
# Check table status
aws dynamodb describe-table --table-name c3ops-website-typeform-dynamodb --profile c3ops-io
```

**Terraform state issues:**
```bash
# Refresh state
terraform refresh

# Show current state
terraform state list
terraform state show aws_s3_bucket.website
```

---

## 📞 Support Resources

- **Terraform Docs**: https://www.terraform.io/docs
- **AWS Docs**: https://docs.aws.amazon.com
- **CloudFront Troubleshooting**: https://docs.aws.amazon.com/cloudfront/latest/developerguide/troubleshooting.html
- **Route53 Guide**: https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/
- **Lambda Logs**: https://docs.aws.amazon.com/lambda/latest/dg/monitoring-cloudwatchlogs.html

---

## ✅ Completion Confirmation

Once deployment is complete and verified:

1. **Backup Terraform State**
   ```bash
   # Keep local backup
   cp -r terraform/ terraform-backup-$(date +%Y%m%d)/
   
   # Consider remote state (S3 backend)
   # See terraform/provider.tf comments for backend setup
   ```

2. **Document Configuration**
   - Save all output values
   - Document any manual configurations
   - Keep certificate ARN for reference

3. **Notify Stakeholders**
   - Domain: c3ops.io is live
   - API endpoint: api.c3ops.io
   - Website hosted in AWS ap-south-2
   - CloudFront CDN active

4. **Schedule Cleanup**
   - Plan c3ops.io domain cleanup (manual)
   - After cleanup, update domain registrar DNS

---

## 📈 Post-Launch Monitoring

### Daily Checks
- CloudFront cache hit ratio
- Lambda function duration
- API Gateway latency
- DynamoDB throttling

### Weekly Checks
- CloudWatch log analysis
- Cost analysis (AWS Billing)
- Performance metrics
- Error rate trends

### Monthly Checks
- Terraform state validation
- Security audit
- Capacity planning
- Cost optimization review

---

## 🎉 SUCCESS!

When you see this, deployment is complete:
```
Outputs:

website_url = "https://c3ops.io"
api_url = "https://api.c3ops.io"
dynamodb_table_name = "c3ops-website-typeform-dynamodb"
```

**Next**: Monitor performance, optimize costs, and plan future features!

---

**Infrastructure Version**: 1.0  
**Status**: ✅ PRODUCTION READY  
**Last Updated**: March 15, 2026  
**Ready to Deploy**: YES ✅

