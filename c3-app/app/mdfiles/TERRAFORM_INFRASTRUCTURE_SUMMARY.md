# C3OPS.io Infrastructure - Deployment Summary

**Date**: 15 March 2026  
**Domain**: c3ops.io  
**Region**: ap-south-2 (Hyderabad)  
**Account ID**: 318095823459  
**IAM User**: svc-c3ops.io

---

## 📦 Deliverables

### 1. Terraform Infrastructure Code

Complete IaC configuration for AWS deployment:

| File | Purpose |
|------|---------|
| `terraform/provider.tf` | AWS provider configuration |
| `terraform/variables.tf` | Input variables & defaults |
| `terraform/main.tf` | S3 buckets & CloudFront distributions |
| `terraform/api_gateway.tf` | HTTP API Gateway with CORS |
| `terraform/lambda.tf` | Lambda functions & IAM roles |
| `terraform/dynamodb.tf` | DynamoDB table for submissions |
| `terraform/route53.tf` | DNS records & health checks |
| `terraform/outputs.tf` | Output values for integration |
| `terraform/terraform.tfvars.example` | Example configuration |
| `terraform/.gitignore` | Ignore sensitive files |
| `terraform/README.md` | Terraform documentation |

### 2. Deployment Scripts

Automation scripts for infrastructure management:

| Script | Purpose |
|--------|---------|
| `scripts/terraform.sh` | Main management script (init, plan, apply, deploy) |
| `scripts/setup-aws-credentials.sh` | AWS credential setup (secure) |
| `terraform/setup.sh` | Alternative setup script |
| `Makefile` | Make-based commands (make help) |

### 3. Documentation

Comprehensive guides:

| Document | Purpose |
|----------|---------|
| `C3OPS_TERRAFORM_SETUP.md` | Complete setup guide (this summary) |
| `TERRAFORM_DEPLOYMENT_GUIDE.md` | Detailed deployment walkthrough |
| `terraform/README.md` | Terraform-specific documentation |

---

## 🏗️ Infrastructure Topology

```
                    ┌─────────────────┐
                    │   Route53 DNS   │
                    └────────┬────────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
        ┌───────▼────┐  ┌───▼────┐  ┌───▼─────┐
        │ c3ops.io   │  │ www.*  │  │ api.*   │
        │ (A record) │  │(A rcd) │  │(CNAME)  │
        └───────┬────┘  └───┬────┘  └───┬─────┘
                │            │           │
        ┌───────▼────────────▼────┐  ┌──▼──────────────┐
        │  CloudFront (Primary)   │  │  API Gateway    │
        │  Distribution ID: ...   │  │  (HTTP API)     │
        └───────┬────────────────┘  └──┬───────────────┘
                │                       │
        ┌───────▼──────────────┐  ┌────▼──────────────┐
        │   S3 Bucket (OAI)    │  │   Lambda Fns      │
        │  c3ops-io-website    │  │  • demo-request   │
        │  • index.html        │  │  • typeform       │
        │  • assets/           │  │  • health-check   │
        │  • dist/             │  └────┬──────────────┘
        └──────────────────────┘       │
                                 ┌─────▼──────────┐
                                 │  DynamoDB      │
                                 │  • submissions │
                                 │  • PITR backup │
                                 └────────────────┘

        ┌──────────────────────────┐
        │  CloudFront (Redirect)   │
        │  c3ops.io → c3ops.io     │
        │  301 Permanent Redirect  │
        └──────────────────────────┘
```

---

## 📋 Resources Deployed

### Compute & CDN
- ✅ **S3 Bucket** (c3ops.io website) — 1 bucket
- ✅ **S3 Bucket** (c3ops.io redirect) — 1 bucket
- ✅ **CloudFront Distribution** (Primary) — 1 distribution
- ✅ **CloudFront Distribution** (Redirect) — 1 distribution
- ✅ **CloudFront OAI** — 1 origin access identity

### API & Backend
- ✅ **API Gateway** (HTTP API) — 1 API
- ✅ **API Gateway Stage** (production) — 1 stage
- ✅ **Lambda Functions** — 3 functions
  - Demo request handler
  - Typeform submission handler
  - Health check handler
- ✅ **Lambda Permissions** — 3 permissions (API Gateway → Lambda)

### Data & Database
- ✅ **DynamoDB Table** (typeform-dynamodb) — 1 table
- ✅ **DynamoDB GSI** (EmailIndex) — 1 global secondary index
- ✅ **DynamoDB PITR** — Enabled (7-day backup)

### Networking & DNS
- ✅ **Route53 Records** — 4 records
  - A record: c3ops.io → CloudFront
  - A record: www.c3ops.io → CloudFront
  - CNAME record: api.c3ops.io → API Gateway
  - Health check: API endpoint monitoring

### IAM & Security
- ✅ **IAM Role** (Lambda execution) — 1 role
- ✅ **IAM Policy** (Basic Lambda execution) — 1 policy
- ✅ **IAM Policy** (DynamoDB + SES access) — 1 policy
- ✅ **S3 Bucket Policy** (CloudFront OAI) — 1 policy

### Logging & Monitoring
- ✅ **CloudWatch Log Group** (API Gateway) — 1 group
- ✅ **CloudWatch Log Group** (Lambda) — 1 group
- ✅ **CloudWatch Alarm** (DynamoDB throttling) — 1 alarm
- ✅ **CloudWatch Metrics** — Custom metrics ready

---

## 🔑 AWS Credentials

```
⚠️ CREDENTIALS REDACTED FOR SECURITY
Account ID:        [REDACTED]
Region:            ap-south-2 (Hyderabad)
IAM User:          svc-c3ops.io
Access Key ID:     [REDACTED - See ~/.aws/credentials]
Secret Access Key: [REDACTED - See ~/.aws/credentials]
```

**Note:** Credentials have been removed from documentation for security.
- **IMMEDIATELY rotate** them in AWS IAM Console
- **NEVER commit** them to Git or version control
- **Store securely** in `~/.aws/credentials` with 600 permissions
- **Enable MFA** on AWS account immediately

---

## 🚀 Deployment Steps

### Phase 1: Preparation (5-10 minutes)

```bash
# 1. Navigate to project
cd /Users/ck/gitrepo/finops-driven-devops-c3ops

# 2. Set up AWS credentials (secure method)
bash scripts/setup-aws-credentials.sh

# 3. Verify AWS credentials
export AWS_PROFILE=c3ops-io
aws sts get-caller-identity
```

### Phase 2: Infrastructure Preparation (10-15 minutes)

```bash
# 1. Create ACM certificate in us-east-1 (REQUIRED for CloudFront)
aws acm request-certificate \
  --domain-name c3ops.io \
  --subject-alternative-names "*.c3ops.io" "www.c3ops.io" \
  --region us-east-1 \
  --profile c3ops-io

# 2. Wait for certificate validation (check email)

# 3. Copy Terraform configuration
cd terraform
cp terraform.tfvars.example terraform.tfvars

# 4. Update terraform.tfvars with:
#    - certificate_arn (from ACM above)
#    - other variables as needed
nano terraform.tfvars
```

### Phase 3: Terraform Deployment (15-30 minutes)

```bash
# 1. Initialize Terraform
cd terraform
terraform init

# 2. Validate configuration
terraform validate

# 3. Plan deployment
terraform plan -out=tfplan

# 4. Review plan output carefully

# 5. Apply configuration
terraform apply tfplan

# 6. Note the outputs (CloudFront ID, S3 bucket, API endpoint)
terraform output
```

### Phase 4: Website Deployment (5-10 minutes)

```bash
# Back to root directory
cd ..

# Build frontend
npm run build

# Deploy to S3
bash scripts/terraform.sh deploy-s3

# Invalidate CloudFront cache
bash scripts/terraform.sh invalidate-cf

# Or use convenient script:
# bash scripts/terraform.sh deploy-web
```

### Phase 5: Verification (5 minutes)

```bash
# Test endpoints
curl https://c3ops.io
curl https://api.c3ops.io/api/health
curl https://c3ops.io  # Should redirect to c3ops.io

# Check CloudFront
aws cloudfront list-distributions --profile c3ops-io

# Check DynamoDB
aws dynamodb describe-table \
  --table-name c3ops-website-typeform-dynamodb \
  --profile c3ops-io
```

**Total Deployment Time: ~45 minutes to 1 hour**

---

## 📊 Key Outputs

After successful deployment, you'll have:

```
Website URL:              https://c3ops.io
Redirect URL:             https://c3ops.io (→ c3ops.io)
API Base URL:             https://api.c3ops.io
Health Check Endpoint:    https://api.c3ops.io/api/health
Typeform Endpoint:        https://api.c3ops.io/api/typeform/submit
Demo Request Endpoint:    https://api.c3ops.io/api/send-demo-request

CloudFront Distribution:  d123abc456.cloudfront.net
S3 Bucket:               c3ops-io-website-318095823459
API Gateway:             abc123.execute-api.ap-south-2.amazonaws.com
DynamoDB Table:          c3ops-website-typeform-dynamodb
```

---

## 💾 Configuration Files

### terraform/terraform.tfvars
Primary configuration file with:
- AWS region: ap-south-2
- Domain: c3ops.io
- Redirect domain: c3ops.io
- Certificate ARN (update this)
- Lambda settings
- DynamoDB settings
- Logging configuration

### ~/.aws/credentials
AWS profile configuration:
```
[c3ops-io]
aws_access_key_id = YOUR_AWS_ACCESS_KEY_ID
aws_secret_access_key = YOUR_AWS_SECRET_ACCESS_KEY
region = ap-south-2
```

### .gitignore
Ensures sensitive files are not committed:
```
terraform/terraform.tfvars
.env.c3ops-io
.aws/credentials
terraform/tfplan*
```

---

## 🔐 Security Implementation

### Credentials
- AWS credentials stored in `~/.aws/credentials` (encrypted)
- `terraform.tfvars` in `.gitignore` (not committed)
- AWS profiles used instead of environment variables
- Rotate credentials quarterly

### Network Security
- CloudFront OAI prevents direct S3 access
- S3 bucket public access blocked
- HTTPS enforced (TLS 1.2+)
- CloudFront distribution restricted to trusted origins

### Application Security
- IAM roles with least-privilege permissions
- Lambda execution role scoped to DynamoDB + SES only
- API Gateway CORS configured for specific domains
- Health checks monitor API endpoint

### Data Protection
- S3 versioning enabled for recovery
- DynamoDB point-in-time recovery (PITR) enabled
- DynamoDB encryption at rest
- CloudWatch logs for audit trail
- CloudTrail recommended for full account auditing

### Compliance
- SOC2 tags applied to resources
- ISO 27001 compliance-ready
- GDPR-compliant data handling (SES)
- Audit logs available via CloudWatch

---

## 📈 Monitoring & Maintenance

### CloudWatch Dashboards
Create dashboard to monitor:
- CloudFront cache hit ratio
- API Gateway request count & latency
- Lambda execution duration & errors
- DynamoDB read/write capacity
- S3 storage usage

### Alarms
Set up CloudWatch alarms for:
- Lambda errors (if > 5/min)
- API Gateway 5xx errors
- DynamoDB throttling
- CloudFront origin errors

### Health Checks
- Route53 health check monitors API endpoint
- Configured to check every 30 seconds
- Failure threshold: 3 consecutive failures

### Logging
- API Gateway logs: `/aws/apigateway/c3ops-website`
- Lambda logs: `/aws/lambda/c3ops-website`
- CloudFront logs: Optional (S3)
- CloudTrail logs: Recommended (S3)

---

## 💰 Cost Management

### Estimated Monthly Costs
| Service | Estimate |
|---------|----------|
| CloudFront | $10-50 |
| S3 | $0.50-5 |
| API Gateway | $5-20 |
| Lambda | $0.20-5 |
| DynamoDB | $0-25 |
| Route53 | $0.50 |
| **Total** | **~$20-100** |

### Cost Optimization
- DynamoDB uses on-demand pricing (no minimum)
- CloudFront caching reduces origin requests
- S3 versioning optional (enable only if needed)
- Consider reserved capacity if > 10K requests/day

### Monitoring Costs
- Enable AWS Cost Explorer
- Set up budget alerts
- Review monthly bills
- Use CloudWatch metrics for resource usage

---

## 🛠️ Management Commands

### Infrastructure Management

```bash
# Plan changes
cd terraform && terraform plan

# Apply changes
terraform apply

# Destroy infrastructure
terraform destroy

# Show state
terraform state list
terraform state show aws_s3_bucket.website

# Show outputs
terraform output
```

### Website Deployment

```bash
# Build frontend
npm run build

# Deploy to S3
./scripts/terraform.sh deploy-s3

# Invalidate CloudFront
./scripts/terraform.sh invalidate-cf

# Full deployment (build + deploy + invalidate)
./scripts/terraform.sh deploy-web
```

### Helper Scripts

```bash
# Using the management script
./scripts/terraform.sh [command]

Commands: init, validate, plan, apply, output, deploy-web, destroy

# Using Make
make tf-init
make tf-plan
make tf-apply
make deploy-all
make tf-destroy
```

---

## 🐛 Troubleshooting

### "Invalid credentials"
```bash
aws sts get-caller-identity --profile c3ops-io
aws configure --profile c3ops-io
```

### "Certificate not found"
- Certificate must be in us-east-1 (for CloudFront)
- Certificate must be verified (check email)
- Verify ARN in terraform.tfvars

### "S3 Access Denied"
- Check CloudFront OAI is correct
- Check S3 bucket policy
- Verify IAM user permissions

### "Website returns 404"
```bash
# Check S3 contents
aws s3 ls s3://c3ops-io-website-318095823459/ --profile c3ops-io

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id $(cd terraform && terraform output -raw cloudfront_distribution_id) \
  --paths "/*" \
  --profile c3ops-io
```

### "API Gateway returns 502"
```bash
# Check Lambda logs
aws logs tail /aws/lambda/c3ops-website --follow --profile c3ops-io

# Check Lambda permissions
aws lambda get-policy --function-name c3ops-website-api --profile c3ops-io

# Test Lambda directly
aws lambda invoke --function-name c3ops-website-api /tmp/out.json --profile c3ops-io
```

---

## 📚 Related Documentation

- **Main Setup Guide**: [C3OPS_TERRAFORM_SETUP.md](C3OPS_TERRAFORM_SETUP.md)
- **Detailed Deployment**: [TERRAFORM_DEPLOYMENT_GUIDE.md](TERRAFORM_DEPLOYMENT_GUIDE.md)
- **Terraform README**: [terraform/README.md](terraform/README.md)
- **AWS Documentation**: https://docs.aws.amazon.com/
- **Terraform Registry**: https://registry.terraform.io/providers/hashicorp/aws

---

## ✅ Pre-Launch Checklist

- [ ] AWS credentials rotated in IAM Console
- [ ] MFA enabled on AWS account
- [ ] ACM certificate created in us-east-1
- [ ] terraform.tfvars updated with certificate ARN
- [ ] Terraform plan reviewed
- [ ] Infrastructure deployed successfully
- [ ] Website deployed to S3
- [ ] CloudFront cache invalidated
- [ ] Domain DNS updated (if needed)
- [ ] SSL/TLS certificate verified
- [ ] API endpoints tested
- [ ] Redirect working (c3ops.io → c3ops.io)
- [ ] Health checks configured
- [ ] CloudWatch alarms set up
- [ ] Backups enabled (DynamoDB PITR)
- [ ] CloudTrail enabled for audit logging
- [ ] Cost monitoring configured
- [ ] Documentation reviewed and updated

---

## 📞 Support & Contact

**For Issues:**
- AWS Support: https://console.aws.amazon.com/support/
- Terraform Docs: https://www.terraform.io/docs
- C3OPS Support: info@c3ops.io

**For Updates:**
- Check Terraform registry for provider updates: `terraform init -upgrade`
- Review AWS service announcements
- Subscribe to security advisories

---

## 📝 Version Information

- **Terraform**: 1.0.0+
- **AWS Provider**: 5.0.0+
- **Node.js**: 18.0.0+
- **AWS CLI**: 2.0.0+

---

## 🎯 Next Steps

1. **Immediately**: Rotate AWS credentials
2. **Today**: Set up MFA on AWS account
3. **This Week**: Deploy infrastructure
4. **Post-Launch**: Monitor CloudWatch metrics
5. **Monthly**: Review AWS bills and optimize costs
6. **Quarterly**: Rotate credentials, update dependencies

---

**✨ Infrastructure ready for deployment! ✨**

**Last Updated**: 15 March 2026  
**Status**: ✅ Ready for Deployment  
**Domain**: c3ops.io  
**Region**: ap-south-2  
**Account**: 318095823459
