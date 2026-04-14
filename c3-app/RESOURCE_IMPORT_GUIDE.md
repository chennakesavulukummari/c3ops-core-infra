# Resource Import & Usage Guide

## Resources Being Imported

The import script imports 4 main existing AWS resources into Terraform state:

### 1. S3 Bucket - UI Deployment
```
Resource ID: c3cloudcostconsole
Terraform ID: aws_s3_bucket.ui_deployment

Purpose: 
- Stores React/Vue frontend code
- Serves static files for the web application

Configuration:
- Versioning: Enabled
- Public Access: Blocked
- Bucket Policy: Restricts access to CloudFront OAC
```

### 2. CloudFront Distribution - Content Delivery
```
Resource ID: E1P2QRT0GYEL2J
Terraform ID: aws_cloudfront_distribution.app_ui

Purpose:
- CDN for UI static files (from S3)
- Reverse proxy for API calls (to ALB)
- HTTPS termination

Caching:
- S3 origin: Default cache (24 hours)
- ALB origin: No cache (API responses)
```

### 3. Route53 Hosted Zone - Domain Management
```
Resource ID: Z099400737QOK0UZ3T989
Domain: cloudcostconsole.com
Terraform ID: aws_route53_zone.app_domain

Purpose:
- DNS authoritative zone
- Manages domain routing
```

### 4. Route53 DNS Records
```
Records:
1. cloudcostconsole.com (root)
   → Points to CloudFront (UI distribution)
   Type: ALIAS (AWS-specific)

2. api.cloudcostconsole.com
   → Points to ALB (API backend)
   Type: ALIAS

3. www.cloudcostconsole.com
   → Points to CloudFront (UI distribution)
   Type: ALIAS
```

## How These Resources Are Used in App Infrastructure

### Data Flow Architecture

```
User Request to cloudcostconsole.com
├─ Route53 lookup
│  ├─ Root domain → CloudFront
│  ├─ api.* → ALB
│  └─ www.* → CloudFront
│
├─ CloudFront CDN
│  ├─ S3 Origin: Static files (UI)
│  └─ ALB Origin: API requests
│
├─ S3 Bucket
│  └─ React/Vue static files
│     (JavaScript, CSS, images)
│
└─ ALB → EC2 (Node.js API) → RDS Database
```

### Resource Integration in Terraform

After import, these resources are referenced in:

#### 1. main.tf - Security Groups
```hcl
# ALB security group allows inbound on 80/443
# from anywhere (CloudFront origin)

resource "aws_security_group" "alb" {
  vpc_id = local.vpc_id
  
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # CloudFront IPs
  }
}
```

#### 2. existing-resources.tf - Imported Resources
```hcl
# S3 Bucket (imported)
resource "aws_s3_bucket" "ui_deployment" {
  bucket = "c3cloudcostconsole"
}

# CloudFront (imported) - references both S3 and ALB
resource "aws_cloudfront_distribution" "app_ui" {
  # Origins:
  # 1. S3 origin (for static files)
  # 2. ALB origin (for API calls)
}

# Route53 (imported) - DNS records
resource "aws_route53_zone" "app_domain" {
  name = "cloudcostconsole.com"
}
```

#### 3. outputs.tf - Exported Values
```hcl
output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.app_ui.id
}

output "route53_zone_id" {
  value = aws_route53_zone.app_domain.zone_id
}
```

## Import Process

### Prerequisites
```bash
# AWS credentials must be configured
aws configure

# Or set environment variables:
export AWS_ACCESS_KEY_ID="your-key"
export AWS_SECRET_ACCESS_KEY="your-secret"
export AWS_DEFAULT_REGION="ap-south-2"
```

### Step-by-Step Import

```bash
cd /Users/ck/c3ops-repos/c3ops-core-infra/c3-app/terraform

# 1. Make script executable
chmod +x import-resources.sh

# 2. Run import (requires AWS credentials)
./import-resources.sh

# 3. Verify imports
terraform state list
# Output should show:
# - aws_s3_bucket.ui_deployment
# - aws_cloudfront_distribution.app_ui
# - aws_route53_zone.app_domain
# - aws_route53_record.* (DNS records)

# 4. Review what terraform sees
terraform plan

# 5. Apply if needed
terraform apply
```

## What Gets Imported to State

The script imports these resources into `terraform.tfstate`:

1. **S3 Bucket Metadata**
   - Bucket name: c3cloudcostconsole
   - Versioning configuration
   - Public access block settings
   - Bucket policy

2. **CloudFront Configuration**
   - Distribution ID: E1P2QRT0GYEL2J
   - Origins (S3 + ALB)
   - Cache behaviors
   - Lambda@Edge associations (if any)

3. **Route53 Zone Configuration**
   - Zone ID: Z099400737QOK0UZ3T989
   - Name servers
   - SOA record

4. **DNS Records**
   - Alias records for domains
   - TTL values
   - Routing policies

## Terraform State Management

After import, Terraform tracks these resources in state:

```bash
# View all imported resources
terraform state list

# Inspect specific resource
terraform state show aws_s3_bucket.ui_deployment

# Remove resource from state (without deleting AWS resource)
terraform state rm aws_s3_bucket.ui_deployment

# Refresh state from AWS
terraform refresh
```

## Usage in Deployment

### When Deploying App Infrastructure:

1. **ALB listens on:**
   - Port 80 (HTTP)
   - Port 443 (HTTPS - if certificate configured)

2. **CloudFront routes to:**
   - S3 for `/` (static UI files)
   - ALB for `/api/*` (dynamic API calls)

3. **Route53 routes to:**
   - `cloudcostconsole.com` → CloudFront
   - `api.cloudcostconsole.com` → ALB
   - `www.cloudcostconsole.com` → CloudFront

### Updating Imported Resources:

After import, you can modify these resources via Terraform:

```bash
# Example: Update S3 bucket policy
# Edit existing-resources.tf
# Then apply:
terraform apply
```

## Troubleshooting

### Import Fails - Resource Not Found
```
Error: aws_s3_bucket.ui_deployment: ResourceNotFound
```
**Solution**: Verify resource ID is correct (c3cloudcostconsole)

### Import Fails - Already Imported
```
Error: Resource already exists in state
```
**Solution**: Resource is already tracked. Run `terraform state list` to verify.

### AWS Credentials Error
```
Unable to locate credentials
```
**Solution**: Configure AWS credentials:
```bash
aws configure
# Or
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
```

## Next Steps After Import

1. ✅ Execute: `./import-resources.sh`
2. ✅ Verify: `terraform state list`
3. ✅ Plan: `terraform plan`
4. ✅ Deploy: `terraform apply`

The imported resources will be managed alongside the newly created infrastructure (ALB, EC2, RDS).
