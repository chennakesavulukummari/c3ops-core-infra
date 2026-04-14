# App Infrastructure - State File Integration Complete ✅

## Summary

The app-specific infrastructure has been successfully configured to reference the core infrastructure state file and import existing AWS resources.

## Configuration Changes

### 1. **State File Reference** (`provider.tf`)
```hcl
data "terraform_remote_state" "core" {
  backend = "local"
  config = {
    path = "../iac/preprod/terraform.tfstate"
  }
}
```
✅ Automatically loads core infrastructure outputs (VPC, subnets, NAT gateway)

### 2. **Removed VPC Variables** (`variables.tf`)
- ❌ Removed `vpc_id` variable
- ❌ Removed `public_subnet_ids` variable  
- ❌ Removed `private_subnet_ids` variable
- ✅ These are now sourced from state file

### 3. **Added State References** (`main.tf` - locals)
```hcl
locals {
  vpc_id              = data.terraform_remote_state.core.outputs.vpc_id
  public_subnet_ids   = data.terraform_remote_state.core.outputs.public_subnet_ids
  private_subnet_ids  = data.terraform_remote_state.core.outputs.private_subnet_ids
}
```

### 4. **Simplified Module Call** (`iac/preprod/app-infra.tf`)
- ❌ Removed VPC parameter passing (vpc_id, subnet_ids)
- ✅ Module automatically references state file
- ✅ Added dependency on core VPC module

## Existing AWS Resources Integration

### Resources to Import
Created Terraform definitions for existing resources:

| Resource Type | Resource ID | File |
|---|---|---|
| S3 Bucket | c3cloudcostconsole | existing-resources.tf |
| CloudFront Distribution | E1P2QRT0GYEL2J | existing-resources.tf |
| Route53 Hosted Zone | Z099400737QOK0UZ3T989 | existing-resources.tf |
| Route53 Records | 3 records | existing-resources.tf |
| CloudFront OAC | c3ops-s3-oac | existing-resources.tf |
| CloudWatch Logs | /aws/cloudfront/c3-app-ui | existing-resources.tf |

### Import Script
```bash
chmod +x terraform/import-resources.sh
./terraform/import-resources.sh
```

This script imports:
- ✅ S3 bucket and versioning
- ✅ S3 public access block
- ✅ S3 bucket policy
- ✅ Route53 hosted zone
- ✅ CloudFront distribution
- ✅ CloudFront OAC
- ✅ Route53 DNS records (if exist)
- ✅ CloudWatch log groups

## Architecture Flow

```
┌─ Deploy Core Infrastructure ─┐
│     (VPC, NAT, Subnets)       │
└─────────────┬─────────────────┘
              │
              │ terraform.tfstate
              ▼
┌─ App Infrastructure ──────────────────┐
│  data.terraform_remote_state.core     │
│  ├─ vpc_id (10.0.0.0/16)              │
│  ├─ public_subnet_ids                 │
│  └─ private_subnet_ids                │
└─────────────┬──────────────────────────┘
              │
        ┌─────┴──────────┬──────────┐
        ▼                ▼          ▼
    ┌─────────┐     ┌──────────┐ ┌──────────┐
    │   ALB   │     │   ASG    │ │   RDS    │
    │ (Public)│     │ (Private)│ │(Private) │
    └─────────┘     └──────────┘ └──────────┘
        │                │            │
        └────┬───────────┴────────────┘
             │
    Public/Private Subnets
    (from Core Infra)
    
    Route53 (cloudcostconsole.com)
    CloudFront (E1P2QRT0GYEL2J)
    S3 (c3cloudcostconsole)
```

## Deployment Workflow

### Phase 1: Initialize & Plan
```bash
cd c3-app/terraform

# Initialize with remote state reference
terraform init

# Plan infrastructure
terraform plan -out=tfplan
```

### Phase 2: Import Existing Resources
```bash
# Import existing S3, CloudFront, Route53
./import-resources.sh

# Verify imports
terraform state list
```

### Phase 3: Apply Infrastructure
```bash
# Create/update app infrastructure
terraform apply tfplan

# Get outputs
terraform output
```

## Data Flow

### Core Infrastructure State → App Infrastructure

1. **Core Infrastructure** (iac/preprod/main.tf):
   - Creates VPC, Subnets, NAT Gateway
   - Outputs: vpc_id, public_subnet_ids, private_subnet_ids
   - Writes to: iac/preprod/terraform.tfstate

2. **App Infrastructure** (c3-app/terraform/main.tf):
   - Reads from: iac/preprod/terraform.tfstate
   - Via data source: `data.terraform_remote_state.core`
   - Uses locals to reference state outputs
   - Creates ALB in public subnets
   - Creates EC2/RDS in private subnets

3. **Existing Resources** (c3-app/terraform/existing-resources.tf):
   - CloudFront serves UI (S3 origin)
   - Route53 routes traffic:
     - cloudcostconsole.com → CloudFront
     - api.cloudcostconsole.com → ALB
   - Imported into: c3-app/terraform.tfstate

## Key Files Modified

### Terraform Configuration
- ✅ `c3-app/terraform/provider.tf` - Added state source
- ✅ `c3-app/terraform/variables.tf` - Removed VPC vars
- ✅ `c3-app/terraform/main.tf` - Updated to use locals
- ✅ `c3-app/terraform/existing-resources.tf` - New file for existing resources
- ✅ `c3-app/terraform/outputs.tf` - Added CDN/Route53 outputs

### Module Configuration
- ✅ `iac/preprod/app-infra.tf` - Simplified module call

### Documentation
- ✅ `c3-app/DEPLOYMENT_GUIDE.md` - Complete deployment steps
- ✅ `c3-app/STATE_FILE_REFERENCE.md` - State file integration details
- ✅ `c3-app/terraform/import-resources.sh` - Import script

## Next Steps

### Step 1: Deploy Core Infrastructure (if not done)
```bash
cd iac/preprod
terraform apply
# Generates terraform.tfstate with VPC outputs
```

### Step 2: Deploy App Infrastructure
```bash
cd c3-app/terraform
terraform init
terraform plan -out=tfplan
```

### Step 3: Import Existing Resources
```bash
./import-resources.sh
```

### Step 4: Apply Application Infrastructure
```bash
terraform apply tfplan
```

### Step 5: Verify Integration
```bash
# Check outputs
terraform output

# View created resources
terraform state list

# Verify connectivity
curl http://$(terraform output -raw alb_dns_name)
```

## Outputs Available

```bash
# Core Infrastructure
terraform output vpc_id
terraform output public_subnet_ids
terraform output private_subnet_ids

# Application Infrastructure
terraform output alb_dns_name
terraform output alb_arn
terraform output asg_name
terraform output rds_endpoint

# Existing Resources
terraform output cloudfront_distribution_id
terraform output route53_zone_id
terraform output ui_s3_bucket_name
terraform output app_domain_name
terraform output app_api_domain
terraform output app_ui_domain
```

## Troubleshooting

### "state file not found"
```bash
# Ensure core infrastructure deployed first
cd iac/preprod && terraform apply
```

### "no outputs found"
```bash
# Check core infrastructure outputs
cd iac/preprod && terraform output
```

### Import fails
```bash
# Get resource IDs from AWS
aws s3 ls | grep c3cloudcostconsole
aws cloudfront list-distributions
aws route53 list-hosted-zones
```

## Security & Best Practices

✅ **Applied**:
- ALB in public subnets only
- EC2/RDS in private subnets (no internet)
- Least privilege security groups
- IAM roles with specific permissions
- CloudFront OAC for S3 access
- S3 versioning and encryption
- 7-day log retention

⚠️ **Production Readiness**:
- [ ] Enable HTTPS with ACM certificate
- [ ] Setup CloudWatch alarms
- [ ] Configure auto-scaling policies
- [ ] Enable AWS WAF
- [ ] Setup CloudTrail audit logs
- [ ] Migrate to S3 remote state + DynamoDB locks

## State File Locations

| Component | State File | Location |
|-----------|-----------|----------|
| Core Infrastructure | terraform.tfstate | iac/preprod/ |
| App Infrastructure | terraform.tfstate | c3-app/terraform/ |
| Remote State (future) | s3:// | AWS S3 |

---

**Configuration Status**: ✅ COMPLETE
**Deployment Status**: ⏳ READY TO DEPLOY
**Last Updated**: April 13, 2026
