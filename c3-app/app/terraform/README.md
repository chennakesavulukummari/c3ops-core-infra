# Terraform Setup for C3OPS.io

Complete Infrastructure as Code (IaC) for deploying C3OPS.io to AWS using Terraform.

## 📁 Directory Structure

```
terraform/
├── provider.tf              # AWS provider configuration
├── variables.tf             # Variable declarations
├── main.tf                  # S3 + CloudFront for website
├── api_gateway.tf           # API Gateway HTTP API
├── lambda.tf                # Lambda functions & IAM roles
├── dynamodb.tf              # DynamoDB table for submissions
├── route53.tf               # DNS configuration
├── outputs.tf               # Output values
├── terraform.tfvars.example # Example configuration
├── setup.sh                 # Setup script
└── .gitignore               # Git ignore rules
```

## 🚀 Quick Start

### 1. Prerequisites

```bash
# Install Terraform
brew install terraform

# Install AWS CLI
brew install awscli

# Verify installations
terraform version
aws --version
```

### 2. Configure Credentials

```bash
cd terraform

# Configure AWS profile
aws configure --profile c3ops-io

# When prompted:
# AWS Access Key ID: [YOUR_AWS_ACCESS_KEY_ID]
# AWS Secret Access Key: [YOUR_AWS_SECRET_ACCESS_KEY]
# Default region: ap-south-2
# Output format: json
```

### 3. Prepare Configuration

```bash
# Copy example configuration
cp terraform.tfvars.example terraform.tfvars

# Edit with your values (especially certificate_arn)
nano terraform.tfvars
```

### 4. Create ACM Certificate

Before deploying, create an SSL certificate in us-east-1 (required for CloudFront):

```bash
aws acm request-certificate \
  --domain-name c3ops.io \
  --subject-alternative-names "*.c3ops.io" \
  --region us-east-1 \
  --profile c3ops-io

# Copy the Certificate ARN to terraform.tfvars
```

### 5. Deploy Infrastructure

```bash
# Initialize Terraform
terraform init

# Review planned changes
terraform plan

# Deploy
terraform apply
```

## 📋 What Gets Deployed

### Compute & Storage
- ✅ **S3 Bucket** — Website hosting (c3ops.io) with versioning & encryption
- ✅ **CloudFront Distribution** — Global CDN with SSL/TLS termination

### API & Backend
- ✅ **API Gateway** — HTTP API with CORS
- ✅ **Lambda Functions** — Demo request, Typeform handler, health check
- ✅ **IAM Roles** — Execution roles with DynamoDB + SES permissions

### Data & Databases
- ✅ **DynamoDB Table** — Typeform submissions with PITR
- ✅ **Global Secondary Index** — Email-based queries
- ✅ **CloudWatch Alarms** — DynamoDB monitoring

### DNS & Networking
- ✅ **Route53 Records** — A records for c3ops.io, www.c3ops.io
- ✅ **Route53 Records** — CNAME for api.c3ops.io
- ✅ **Route53 Health Check** — API endpoint monitoring

### Logging & Monitoring
- ✅ **CloudWatch Logs** — Lambda, API Gateway, custom metrics
- ✅ **Log Groups** — 30-day retention by default

## 🔧 Management Commands

### Using Script

```bash
./scripts/terraform.sh [command]

Commands:
  init            Initialize Terraform
  validate        Validate configuration
  plan            Plan changes
  apply           Apply changes
  output          Show outputs
  state           Show state
  destroy         Destroy infrastructure
  build           Build frontend
  deploy-web      Deploy website (build + upload + invalidate)
```

### Using Make

```bash
make help           # Show help
make tf-init        # Initialize
make tf-plan        # Plan
make tf-apply       # Apply
make deploy-all     # Full deployment
make tf-destroy     # Destroy
```

### Manual Terraform Commands

```bash
export AWS_PROFILE=c3ops-io

# Initialize
terraform init

# Validate
terraform validate

# Plan
terraform plan -out=tfplan

# Apply
terraform apply tfplan

# Show outputs
terraform output

# Destroy
terraform destroy
```

## 📊 Outputs

After deployment, you'll get:

```
cloudfront_domain_name = "d123abc456.cloudfront.net"
cloudfront_distribution_id = "E1A2B3C4D5E6F7G8H9"
s3_bucket_name = "c3ops-io-website-318095823459"
api_gateway_endpoint = "https://abc123.execute-api.ap-south-2.amazonaws.com/production"
website_url = "https://c3ops.io"
api_url = "https://api.c3ops.io"
dynamodb_table_name = "c3ops-website-typeform-dynamodb"
aws_account_id = "318095823459"
deployment_region = "ap-south-2"
```

## 🌐 Post-Deployment

### Upload Website

```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://c3ops-io-website-318095823459/ \
  --profile c3ops-io \
  --cache-control "public, max-age=3600" \
  --exclude "index.html"

# Upload index.html with no-cache
aws s3 cp dist/index.html s3://c3ops-io-website-318095823459/ \
  --profile c3ops-io \
  --cache-control "public, max-age=0, must-revalidate"
```

### Invalidate CloudFront

```bash
DIST_ID=$(terraform output -raw cloudfront_distribution_id)

aws cloudfront create-invalidation \
  --distribution-id $DIST_ID \
  --paths "/*" \
  --profile c3ops-io
```

### Deploy Lambdas

Update `lambda.tf` with the actual Lambda source code paths:

```hcl
# In lambda.tf
source_code_hash = filebase64sha256("../server/index.js")
# or use a lambda layer for dependencies
```

## 🔐 Security

✅ **Best Practices Implemented:**
- Credentials stored in `~/.aws/credentials` (encrypted)
- `terraform.tfvars` in `.gitignore` (not committed)
- No secrets in code or variables
- S3 bucket public access blocked
- CloudFront OAI for S3 access
- DynamoDB encryption at rest
- HTTPS everywhere (CloudFront)
- IAM roles with least privilege
- CloudWatch logs for audit trail

❌ **Never do:**
- Commit `terraform.tfvars` to Git
- Share AWS credentials
- Hardcode secrets in code
- Use AWS_SECRET_ACCESS_KEY in environment

## 📝 Configuration

Edit `terraform.tfvars` to customize:

```hcl
aws_region              = "ap-south-2"
environment             = "production"
domain_name             = "c3ops.io"
certificate_arn         = "arn:aws:acm:us-east-1:..."
lambda_memory           = 256
lambda_timeout          = 30
dynamodb_billing_mode   = "PAY_PER_REQUEST"
log_retention_days      = 30
```

## 🐛 Troubleshooting

**"The security token included in the request is invalid"**
```bash
aws sts get-caller-identity --profile c3ops-io
```

**"No certificate found"**
- ACM certificate must be in `us-east-1`
- Update `certificate_arn` in `terraform.tfvars`

**"S3 404 errors"**
```bash
# Check S3 bucket
aws s3 ls s3://c3ops-io-website-318095823459/ --profile c3ops-io

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id DIST_ID --paths "/*" --profile c3ops-io
```

## 📚 Documentation

- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/)
- [AWS Terraform Best Practices](https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/patterns.html)
- [C3OPS Main README](../README.md)
- [TERRAFORM_DEPLOYMENT_GUIDE.md](../TERRAFORM_DEPLOYMENT_GUIDE.md)

## 🚨 Important Notes

1. **Region**: All resources are in `ap-south-2` (Hyderabad)
2. **Costs**: Uses on-demand pricing (DynamoDB PAY_PER_REQUEST)
3. **Backup**: DynamoDB has point-in-time recovery enabled
4. **Monitoring**: CloudWatch logs retained for 30 days

## 📞 Support

For issues or questions:
- Check AWS CloudWatch logs
- Review Terraform state: `terraform state list`
- Run validation: `terraform validate`
- Check AWS Console for resource status

---

**Last Updated**: 2026-03-15  
**Terraform Version**: 1.0+  
**AWS Region**: ap-south-2  
**Account**: 318095823459
