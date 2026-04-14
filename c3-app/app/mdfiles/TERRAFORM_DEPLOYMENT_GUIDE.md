# C3OPS.io Infrastructure Deployment Guide

## Prerequisites

### 1. **AWS Account Setup**
- AWS Account ID: [REDACTED]
- IAM User: `svc-c3ops.io`
- Region: `ap-south-2` (Hyderabad)
- Access Key ID: Stored securely in `~/.aws/credentials`
- Secret Access Key: Stored securely in `~/.aws/credentials`

### 2. **Tools Installation**

```bash
# Install Terraform
brew install terraform      # macOS
sudo apt-get install terraform  # Ubuntu/Linux

# Install AWS CLI v2
# Download from: https://aws.amazon.com/cli/

# Verify installations
terraform version
aws --version
```

### 3. **ACM Certificate (IMPORTANT)**

Create SSL/TLS certificate for HTTPS in **us-east-1** (required for CloudFront):

```bash
# Use AWS Console or AWS CLI
aws acm request-certificate \
  --domain-name c3ops.io \
  --subject-alternative-names "*.c3ops.io" "www.c3ops.io" \
  --region us-east-1 \
  --profile c3ops-io

# Copy the Certificate ARN and paste it in terraform.tfvars
# Example: arn:aws:acm:us-east-1:318095823459:certificate/abc123def456
```

---

## Setup Steps

### Step 1: Initialize AWS Credentials

```bash
cd terraform

# Configure AWS CLI profile for c3ops.io
aws configure --profile c3ops-io

# When prompted, enter:
# AWS Access Key ID: [YOUR_ACCESS_KEY_ID]
# AWS Secret Access Key: [YOUR_SECRET_ACCESS_KEY]
# Default region: ap-south-2
# Default output format: json
```

**Alternative: Set environment variables**
```bash
export AWS_PROFILE=c3ops-io
# OR
export AWS_ACCESS_KEY_ID=[YOUR_ACCESS_KEY_ID]
export AWS_SECRET_ACCESS_KEY=[YOUR_SECRET_ACCESS_KEY]
export AWS_DEFAULT_REGION=ap-south-2
```

### Step 2: Prepare Configuration

```bash
cd terraform

# Copy example configuration
cp terraform.tfvars.example terraform.tfvars

# Edit terraform.tfvars with your values
# IMPORTANT: Update certificate_arn from Step 1
nano terraform.tfvars
```

### Step 3: Initialize Terraform

```bash
export AWS_PROFILE=c3ops-io

terraform init
```

**Output:**
```
Terraform has been successfully initialized!
```

### Step 4: Validate Configuration

```bash
terraform validate

terraform fmt -recursive
```

### Step 5: Plan Deployment

```bash
terraform plan -out=tfplan
```

**Review the plan output carefully**
- Check S3 buckets
- Verify CloudFront distributions
- Confirm Lambda functions
- Review DynamoDB configuration
- Validate Route53 records

### Step 6: Apply Configuration

```bash
terraform apply tfplan
```

**This will:**
✅ Create S3 bucket for website  
✅ Set up CloudFront CDN  
✅ Create Lambda functions  
✅ Set up API Gateway  
✅ Configure DynamoDB  
✅ Create Route53 DNS records  
✅ Configure redirect (c3ops.io → c3ops.io)  

---

## Output Values

After successful deployment, Terraform will output:

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

---

## Post-Deployment Steps

### 1. **Upload Website to S3**

```bash
# Build your Vite app
npm run build

# Upload to S3
aws s3 sync dist/ s3://c3ops-io-website-318095823459/ \
  --profile c3ops-io \
  --cache-control "public, max-age=3600" \
  --exclude "index.html" \
  --exclude ".git/*"

# Upload index.html with no-cache
aws s3 cp dist/index.html s3://c3ops-io-website-318095823459/index.html \
  --profile c3ops-io \
  --cache-control "public, max-age=0, must-revalidate" \
  --content-type "text/html"
```

### 2. **Invalidate CloudFront Cache**

```bash
terraform output cloudfront_distribution_id

aws cloudfront create-invalidation \
  --distribution-id E1A2B3C4D5E6F7G8H9 \
  --paths "/*" \
  --profile c3ops-io
```

### 3. **Deploy Lambda Functions**

Package and upload your Node.js Lambda code:

```bash
# Create ZIP for demo request Lambda
cd server
zip -r ../demo-request.zip .
cd ..

# Create ZIP for typeform Lambda
cd lambda
zip -r ../typeform-handler.zip .
cd ..

# Upload using Terraform (update lambda.tf with source files)
terraform apply
```

### 4. **Configure DNS**

Ensure Route53 records are set:
- `c3ops.io` → CloudFront (A record)
- `www.c3ops.io` → CloudFront (A record)
- `api.c3ops.io` → API Gateway (CNAME record)

### 5. **Enable Email in SES**

```bash
# Request production access for SES
aws ses describe-configuration-set \
  --profile c3ops-io

# Verify email addresses
aws ses verify-email-identity \
  --email-address info@c3ops.io \
  --profile c3ops-io
```

---

## Management Commands

### View Infrastructure

```bash
export AWS_PROFILE=c3ops-io

# Show current state
terraform state list

# Show specific resource
terraform state show aws_s3_bucket.website

# Show outputs
terraform output
```

### Update Configuration

```bash
# Edit variables
nano terraform/terraform.tfvars

# Plan changes
terraform plan

# Apply changes
terraform apply
```

### Destroy Infrastructure (if needed)

```bash
terraform destroy -auto-approve
```

⚠️ **WARNING**: This will delete all resources!

---

## Troubleshooting

### Error: "UnrecognizedClientException: The security token included in the request is invalid"

**Solution:** Check AWS credentials
```bash
aws sts get-caller-identity --profile c3ops-io
```

### Error: "InvalidUserID.Malformed in us-east-1"

**Solution:** ACM certificate must be in `us-east-1` for CloudFront
```bash
aws acm request-certificate \
  --domain-name c3ops.io \
  --region us-east-1 \
  --profile c3ops-io
```

### Error: "No certificate found"

**Solution:** Update `certificate_arn` in `terraform.tfvars`

### CloudFront shows 404 on website

**Solution:** 
1. Ensure S3 bucket contains `index.html`
2. Invalidate CloudFront cache:
   ```bash
   aws cloudfront create-invalidation \
     --distribution-id YOUR_DIST_ID \
     --paths "/*" \
     --profile c3ops-io
   ```

---

## Security Best Practices

✅ **DO:**
- Store credentials in `~/.aws/credentials` (secure, encrypted)
- Use AWS profiles: `aws configure --profile c3ops-io`
- Keep `terraform.tfvars` in `.gitignore`
- Enable MFA on AWS account
- Rotate access keys quarterly
- Use IAM roles for Lambda functions
- Enable CloudWatch logs for auditing

❌ **DON'T:**
- Never commit credentials to Git
- Never share access keys in messages
- Never use credentials in Terraform code
- Never hardcode secrets in Lambda functions

---

## Support & Documentation

- **Terraform Docs**: https://www.terraform.io/docs
- **AWS Terraform Provider**: https://registry.terraform.io/providers/hashicorp/aws
- **C3OPS GitHub**: [Your repo URL]
- **Contact**: info@c3ops.io

---

## Monitoring

Monitor your infrastructure via AWS Console:

1. **CloudFront**: https://console.aws.amazon.com/cloudfront/
2. **Lambda**: https://console.aws.amazon.com/lambda/
3. **DynamoDB**: https://console.aws.amazon.com/dynamodb/
4. **API Gateway**: https://console.aws.amazon.com/apigateway/
5. **Route53**: https://console.aws.amazon.com/route53/
6. **CloudWatch**: https://console.aws.amazon.com/cloudwatch/

Set up CloudWatch alarms for:
- Lambda errors
- DynamoDB throttling
- API Gateway 5xx errors
- CloudFront cache misses

---

**Last Updated**: 2026-03-15  
**Infrastructure as Code**: Terraform 1.0+  
**AWS Region**: ap-south-2
