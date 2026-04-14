# Manual Resource Import Instructions

## Issue
AWS credentials are not currently configured. You need to either:

1. **Option A**: Configure AWS credentials and run the import script
2. **Option B**: Manually import resources using Terraform commands

## Option A: Configure AWS Credentials & Run Script

### 1. Configure AWS Credentials
```bash
# Method 1: Interactive setup
aws configure

# Follow prompts:
# AWS Access Key ID: [YOUR_KEY]
# AWS Secret Access Key: [YOUR_SECRET]
# Default region: ap-south-2
# Default output: json

# Method 2: Environment variables
export AWS_ACCESS_KEY_ID="your-access-key-id"
export AWS_SECRET_ACCESS_KEY="your-secret-access-key"
export AWS_DEFAULT_REGION="ap-south-2"

# Method 3: AWS credentials file (~/.aws/credentials)
[default]
aws_access_key_id = YOUR_KEY_ID
aws_secret_access_key = YOUR_SECRET_KEY
```

### 2. Execute Import Script
```bash
cd /Users/ck/c3ops-repos/c3ops-core-infra/c3-app/terraform
chmod +x import-resources.sh
./import-resources.sh
```

## Option B: Manual Import Commands

If you have AWS credentials, run these commands individually:

### Step 1: Import S3 Bucket
```bash
cd /Users/ck/c3ops-repos/c3ops-core-infra/c3-app/terraform

# S3 bucket
terraform import aws_s3_bucket.ui_deployment c3cloudcostconsole

# S3 versioning
terraform import aws_s3_bucket_versioning.ui_deployment c3cloudcostconsole

# S3 public access block
terraform import aws_s3_bucket_public_access_block.ui_deployment c3cloudcostconsole

# S3 bucket policy
terraform import aws_s3_bucket_policy.ui_deployment c3cloudcostconsole
```

### Step 2: Import Route53 Hosted Zone
```bash
terraform import aws_route53_zone.app_domain Z099400737QOK0UZ3T989
```

### Step 3: Import CloudFront Distribution
```bash
terraform import aws_cloudfront_distribution.app_ui E1P2QRT0GYEL2J
```

### Step 4: Import Route53 Records
```bash
# Root domain (cloudcostconsole.com)
terraform import aws_route53_record.app_cdn "Z099400737QOK0UZ3T989_cloudcostconsole.com_A"

# API subdomain (api.cloudcostconsole.com)
terraform import aws_route53_record.app_alb "Z099400737QOK0UZ3T989_api.cloudcostconsole.com_A"

# WWW subdomain (www.cloudcostconsole.com)
terraform import aws_route53_record.app_www "Z099400737QOK0UZ3T989_www.cloudcostconsole.com_A"
```

### Step 5: Import CloudFront Origin Access Control (if exists)
```bash
# First, get the OAC ID:
aws cloudfront list-origin-access-controls \
  --query "OriginAccessControlList.Items[?Name=='c3ops-s3-oac'].Id" \
  --output text

# Then import (replace OAC_ID with the value from above):
terraform import aws_cloudfront_origin_access_control.app_s3 OAC_ID
```

### Step 6: Import CloudWatch Log Group (if exists)
```bash
terraform import aws_cloudwatch_log_group.cloudfront_logs /aws/cloudfront/c3-app-ui
```

## Verification Steps

After importing (whether via script or manual):

### 1. List Imported Resources
```bash
terraform state list

# Expected output:
# aws_s3_bucket.ui_deployment
# aws_s3_bucket_versioning.ui_deployment
# aws_s3_bucket_public_access_block.ui_deployment
# aws_s3_bucket_policy.ui_deployment
# aws_route53_zone.app_domain
# aws_route53_record.app_alb
# aws_route53_record.app_cdn
# aws_route53_record.app_www
# aws_cloudfront_distribution.app_ui
```

### 2. Check Resource Details
```bash
# View S3 bucket details in state
terraform state show aws_s3_bucket.ui_deployment

# View CloudFront distribution details
terraform state show aws_cloudfront_distribution.app_ui

# View Route53 zone details
terraform state show aws_route53_zone.app_domain
```

### 3. Verify Plan (no changes expected)
```bash
terraform plan

# Should show:
# No changes. Infrastructure is up-to-date.
```

### 4. Check State File
```bash
# View the actual state (contains all resource details)
cat terraform.tfstate | grep -A5 "ui_deployment"
```

## How Imported Resources Are Used

### Architecture After Import

```
                    User Request
                         │
                         ▼
                   Route53 Lookup
                    (Imported Zone)
                    /      |      \
                   /       |       \
            cloudcost.  api.  www.
             com         cloudcost  cloudcost
             │           │          │
             ▼           ▼          ▼
        CloudFront    ALB         CloudFront
        (Imported)  (Created)    (Imported)
             │                      │
             ├─→ S3 Bucket ←─┤    │
             │   (Imported)   │    │
             │                │    │
             └────────────────┼────┘
                              │
                    Static Files Cached
```

### Resource References in Code

1. **existing-resources.tf**
   - Defines S3, CloudFront, Route53 resources
   - These get imported into state

2. **main.tf**
   - Creates ALB, EC2, RDS
   - ALB is referenced by CloudFront (via existing-resources.tf)

3. **outputs.tf**
   - Exports CloudFront and Route53 IDs
   - Used for DNS and CDN configuration

## Complete Workflow

```bash
# 1. Configure credentials (if not done)
aws configure

# 2. Navigate to app terraform directory
cd /Users/ck/c3ops-repos/c3ops-core-infra/c3-app/terraform

# 3. Execute import script
chmod +x import-resources.sh
./import-resources.sh

# 4. Verify imports succeeded
terraform state list

# 5. Review changes
terraform plan

# 6. If everything looks good
terraform apply

# 7. Check outputs
terraform output
```

## Troubleshooting

### Problem: "Unable to locate credentials"
**Solution:**
```bash
aws configure
# Or set environment variables for credentials
```

### Problem: "ResourceNotFound" error
**Solution:**
- Verify resource ID is correct
- Check resource exists in AWS console
- Example: `aws s3 ls | grep c3cloudcostconsole`

### Problem: "Resource already exists in state"
**Solution:**
```bash
# Resource already imported, verify state:
terraform state show aws_s3_bucket.ui_deployment
```

### Problem: "InvalidInputException" for Route53 records
**Solution:**
- Record format: `ZONE_ID_FQDN_RECORDTYPE`
- Example: `Z099400737QOK0UZ3T989_cloudcostconsole.com_A`

## What's Next

After successful import:

1. ✅ Resources are tracked in Terraform state
2. ✅ terraform plan should show no changes needed
3. ✅ Can deploy new resources (ALB, EC2, RDS) alongside imported ones
4. ✅ All managed by single terraform state file

The imported resources provide the frontend delivery (S3 + CloudFront) and DNS routing (Route53) for your application infrastructure.
