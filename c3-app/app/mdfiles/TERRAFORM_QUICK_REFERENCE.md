# C3OPS.io Terraform - Quick Reference Card

## 🔐 AWS Credentials
```
Account:    318095823459
Region:     ap-south-2
User:       svc-c3ops.io
Profile:    c3ops-io
```

⚠️ **CRITICAL**: Rotate credentials IMMEDIATELY after setup!

---

## 🚀 Quick Start (5 Steps)

### 1. Configure Credentials
```bash
bash scripts/setup-aws-credentials.sh
export AWS_PROFILE=c3ops-io
```

### 2. Create ACM Certificate (us-east-1)
```bash
aws acm request-certificate \
  --domain-name c3ops.io \
  --subject-alternative-names "*.c3ops.io" \
  --region us-east-1 \
  --profile c3ops-io
```
Copy the ARN → Update `terraform/terraform.tfvars`

### 3. Deploy Infrastructure
```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
nano terraform.tfvars  # Add certificate_arn
terraform init
terraform plan
terraform apply
```

### 4. Deploy Website
```bash
cd ..
npm run build
./scripts/terraform.sh deploy-web
```

### 5. Verify
```bash
curl https://c3ops.io
curl https://api.c3ops.io/api/health
```

---

## 📋 Key Files

```
terraform/
├── provider.tf           (AWS setup)
├── variables.tf          (Input variables)
├── main.tf              (S3 + CloudFront)
├── api_gateway.tf       (API setup)
├── lambda.tf            (Lambda functions)
├── dynamodb.tf          (Database)
├── route53.tf           (DNS)
├── outputs.tf           (Outputs)
└── terraform.tfvars.example
```

---

## 🎯 Infrastructure Overview

```
                        Route53
                          ↓
          ┌───────────────┼───────────────┐
          ↓               ↓               ↓
      c3ops.io      www.c3ops.io    api.c3ops.io
          ↓               ↓               ↓
    CloudFront ─────── S3 Bucket    API Gateway
                                          ↓
                                    Lambda Functions
                                          ↓
                                      DynamoDB
```

---

## 📖 Commands Reference

### Terraform
```bash
cd terraform

terraform init              # First time setup
terraform validate          # Check syntax
terraform plan             # Preview changes
terraform apply            # Deploy
terraform output           # Show outputs
terraform destroy          # Remove all
terraform state list       # Show resources
```

### Website Deployment
```bash
./scripts/terraform.sh deploy-web       # Full deploy
./scripts/terraform.sh deploy-s3        # Upload to S3
./scripts/terraform.sh invalidate-cf    # Clear cache
npm run build                           # Build frontend
```

### Make Commands
```bash
make help                   # Show all commands
make tf-init               # Initialize
make tf-plan               # Plan
make tf-apply              # Apply
make deploy-all            # Full deployment
make tf-destroy            # Destroy
```

---

## 🌐 Endpoints After Deployment

```
Website:     https://c3ops.io
Redirect:    https://c3ops.io → c3ops.io
API:         https://api.c3ops.io
Health:      https://api.c3ops.io/api/health
Typeform:    https://api.c3ops.io/api/typeform/submit
```

---

## 🔍 Troubleshooting

| Issue | Solution |
|-------|----------|
| Invalid credentials | `aws sts get-caller-identity --profile c3ops-io` |
| Certificate not found | Must be in us-east-1, check ARN in tfvars |
| S3 access denied | Verify CloudFront OAI and bucket policy |
| Website 404 | `./scripts/terraform.sh invalidate-cf` |
| API 502 | Check Lambda logs: `aws logs tail /aws/lambda/c3ops-website` |

---

## 📊 Outputs to Save

After `terraform apply`:
```bash
terraform output > deployment.txt
# Save these values:
# - cloudfront_distribution_id
# - s3_bucket_name
# - api_gateway_endpoint
# - website_url
```

---

## 💰 Estimated Costs

| Service | Cost |
|---------|------|
| CloudFront | $10-50/mo |
| S3 | $0.50-5/mo |
| API Gateway | $5-20/mo |
| Lambda | $0.20-5/mo |
| DynamoDB | $0-25/mo |
| Route53 | $0.50/mo |
| **Total** | **~$20-100/mo** |

---

## ✅ Pre-Deployment Checklist

- [ ] AWS credentials configured
- [ ] Credentials rotated
- [ ] ACM certificate created (us-east-1)
- [ ] terraform.tfvars updated
- [ ] terraform validate passes
- [ ] terraform plan reviewed
- [ ] npm dependencies installed
- [ ] MFA enabled on AWS

---

## 🔐 Security Reminders

✅ DO:
- Use AWS profiles (`c3ops-io`)
- Store credentials in `~/.aws/credentials`
- Keep `terraform.tfvars` in `.gitignore`
- Enable MFA on AWS account
- Rotate credentials quarterly
- Use HTTPS everywhere

❌ DON'T:
- Commit `.tfvars` files
- Share AWS credentials
- Use credentials in code
- Hardcode secrets
- Allow public S3 access
- Use HTTP (non-HTTPS)

---

## 📞 Quick Help

```bash
# Show all available commands
./scripts/terraform.sh help

# Show tool versions
./scripts/terraform.sh version

# Verify AWS setup
aws sts get-caller-identity --profile c3ops-io

# Show Terraform state
terraform state list

# Get specific output
terraform output cloudfront_distribution_id
```

---

## 📚 Documentation Files

- `TERRAFORM_INFRASTRUCTURE_SUMMARY.md` - Complete overview
- `C3OPS_TERRAFORM_SETUP.md` - Setup guide
- `TERRAFORM_DEPLOYMENT_GUIDE.md` - Detailed walkthrough
- `terraform/README.md` - Terraform docs

---

## 🎯 Common Tasks

### Update Website
```bash
npm run build
./scripts/terraform.sh deploy-web
```

### Change Lambda Memory
```bash
nano terraform/terraform.tfvars
# Update lambda_memory = 512
terraform plan
terraform apply
```

### View Logs
```bash
aws logs tail /aws/lambda/c3ops-website --follow --profile c3ops-io
```

### Check Costs
```bash
aws ce get-cost-and-usage \
  --time-period Start=2026-03-01,End=2026-03-15 \
  --granularity MONTHLY \
  --metrics "UnblendedCost" \
  --profile c3ops-io
```

---

## 🚨 Emergency Commands

```bash
# Destroy everything (CAREFUL!)
terraform destroy

# Force destroy without confirmation
terraform destroy -auto-approve

# Rollback to previous state
terraform apply -auto-approve -lock=false  # Then revert manually

# Emergency S3 backup
aws s3 sync s3://c3ops-io-website-318095823459 ./backup-s3 --profile c3ops-io

# Emergency DynamoDB backup
aws dynamodb create-backup \
  --table-name c3ops-website-typeform-dynamodb \
  --backup-name emergency-backup-$(date +%s) \
  --profile c3ops-io
```

---

**Status**: ✅ Ready to Deploy  
**Last Updated**: 2026-03-15  
**Account**: 318095823459  
**Region**: ap-south-2
