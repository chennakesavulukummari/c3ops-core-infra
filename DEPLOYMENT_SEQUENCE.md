# Deployment Sequence - CRITICAL ORDER

## Problem Encountered
App infrastructure deployment failed because:
1. Core infrastructure state file doesn't exist yet
2. terraform_remote_state in app cannot read outputs
3. App uses hardcoded VPC ID instead of core VPC

## Solution: Deploy in Correct Order

### STEP 1: Deploy Core Infrastructure FIRST
```bash
cd /Users/ck/c3ops-repos/c3ops-core-infra/iac/preprod

# Initialize with S3 backend
terraform init

# Plan and review
terraform plan

# Apply to create VPC, subnets, NAT gateway
terraform apply
```

**What this creates:**
- VPC: `vpc_id` output
- Public Subnets: `public_subnet_ids` output  
- Private Subnets: `private_subnet_ids` output
- State file: `s3://c3ops-terraform-statefiles/c3ops_preprod/terraform.tfstate`

### STEP 2: Deploy App Infrastructure SECOND
Once core infrastructure state file exists in S3:

```bash
cd /Users/ck/c3ops-repos/c3ops-core-infra/c3-app/terraform

# Initialize with S3 backend
terraform init

# Plan and review (will now read core VPC from state file)
terraform plan

# Optional: Import existing S3 bucket
./import-resources.sh

# Apply infrastructure
export TF_VAR_db_password="your-secure-password"
terraform apply
```

**What this creates:**
- Reads VPC/subnets from core state file
- Creates ALB in public subnets
- Creates EC2 in private subnets
- Creates RDS in private subnets
- State file: `s3://c3ops-terraform-statefiles/c3app_preprod/c3-app-terraform.tfstate`

## Data Flow
```
┌─ Core Infrastructure Deployment ─┐
│ iac/preprod/                      │
│ ├─ Creates VPC + Subnets          │
│ └─ State → S3 Bucket              │
└──────────────┬────────────────────┘
               │
               ↓ (reads state file)
┌──────────────────────────────────┐
│ App Infrastructure Deployment    │
│ c3-app/terraform/                │
│ ├─ Reads VPC from state          │
│ ├─ Creates ALB, EC2, RDS        │
│ └─ State → S3 Bucket             │
└──────────────────────────────────┘
```

## Current Status

❌ **ERROR**: Core infrastructure not deployed yet
- VPC doesn't exist
- terraform_remote_state cannot read outputs
- App deployment fails

✅ **NEXT ACTION**: Deploy core infrastructure first

```bash
cd iac/preprod
terraform apply
```

After core is deployed, app will have access to:
- `data.terraform_remote_state.core.outputs.vpc_id`
- `data.terraform_remote_state.core.outputs.public_subnet_ids`
- `data.terraform_remote_state.core.outputs.private_subnet_ids`

## Troubleshooting

**Issue**: "vpc ID 'vpc-xxx' does not exist"
- **Cause**: Core infrastructure not deployed
- **Fix**: Deploy core first: `cd iac/preprod && terraform apply`

**Issue**: "BucketAlreadyOwnedByYou"
- **Cause**: S3 bucket exists but not in Terraform state
- **Fix**: Import it: `./import-resources.sh`

**Issue**: "terraform_remote_state cannot read state"
- **Cause**: AWS credentials issue or S3 bucket not accessible
- **Fix**: Check AWS credentials, ensure S3 bucket `c3ops-terraform-statefiles` exists and is readable
