# Infrastructure Architecture Separation

## Problem Fixed

The core infrastructure was incorrectly requesting `db_username` and `db_password` variables, which belong to the **app-specific infrastructure**, not the core.

## Root Cause

Application infrastructure variables and module were mistakenly merged into the core infrastructure configuration:
- **iac/preprod/variables.tf** contained app-specific vars
- **iac/preprod/app-infra.tf** called the app module as a child module
- **iac/preprod/outputs.tf** referenced app module outputs

## Solution: Proper Separation of Concerns

### Core Infrastructure (iac/preprod/)
**Purpose**: Provision VPC and base networking only

**Variables**:
- VPC configuration (CIDR, subnets)
- Availability zones
- NAT Gateway, Flow Logs
- General tags

**Outputs**:
- vpc_id
- public_subnet_ids
- private_subnet_ids
- nat_gateway_ips
- internet_gateway_id
- security_group_ids

**Does NOT include**:
- ~~db_username~~
- ~~db_password~~
- ~~instance_type~~
- ~~AMI ID~~
- ~~Any app-specific configuration~~

### App Infrastructure (c3-app/terraform/)
**Purpose**: Deploy application stack on top of core infrastructure

**Gets VPC data via**: `terraform_remote_state` data source reading core state file

**Variables** (configured in c3-app/terraform/variables.tf):
- db_username (required)
- db_password (required)
- instance_type
- ami_id
- asg_desired_capacity
- asg_min_size
- asg_max_size
- database configuration
- HTTPS configuration

**Deployment**: Independent deployment, NOT called as module from core

## Data Flow

```
┌─────────────────────────────────────┐
│  Core Infrastructure                │
│  (iac/preprod/)                     │
│                                     │
│  terraform.tfstate                  │
│  ├─ vpc_id                          │
│  ├─ public_subnet_ids               │
│  └─ private_subnet_ids              │
└────────────────┬────────────────────┘
                 │
                 │ (via terraform_remote_state)
                 │
┌────────────────▼────────────────────┐
│  App Infrastructure                 │
│  (c3-app/terraform/)                │
│                                     │
│  Uses core outputs in locals        │
│  ├─ ALB in public_subnets           │
│  ├─ EC2 in private_subnets          │
│  └─ RDS in private_subnets          │
└─────────────────────────────────────┘
```

## Deployment Sequence

### Phase 1: Deploy Core Infrastructure
```bash
cd iac/preprod
terraform init
terraform plan
terraform apply
```

This creates the VPC and outputs state file at `iac/preprod/terraform.tfstate`

### Phase 2: Deploy App Infrastructure
```bash
cd c3-app/terraform
terraform init
# App automatically discovers core VPC from state file
export TF_VAR_db_password="your-password"
terraform plan
terraform apply
```

## Files Changed to Fix This Issue

### ✅ iac/preprod/variables.tf
**Removed**: All app-specific variables
- db_username, db_password
- instance_type, ami_id
- asg_desired_capacity, asg_min_size, asg_max_size
- database configuration variables
- HTTPS configuration variables

**Kept**: Only core infrastructure variables
- AWS region, environment
- VPC CIDR, subnet CIDRs
- Availability zones
- NAT Gateway, Flow Logs flags
- Tags

### ✅ iac/preprod/app-infra.tf
**Changed**: Removed entire app module call
```terraform
# BEFORE (WRONG):
module "app_infrastructure" {
  source = "../../c3-app/terraform"
  # ... many app variables ...
}

# AFTER (CORRECT):
# Note: Application infrastructure is deployed separately from c3-app/terraform
# The app infrastructure automatically references this core infrastructure
# via terraform_remote_state data source in c3-app/terraform/provider.tf
```

**Why**: App infrastructure should never be called as a module from core. It's independent.

### ✅ iac/preprod/terraform.tfvars
**Removed**: All app-specific configuration
- app_name, instance_type, ami_id
- asg_desired_capacity, asg_min_size, asg_max_size
- database configuration values
- HTTPS configuration values

**Kept**: Only core infrastructure configuration

### ✅ iac/preprod/outputs.tf
**Removed**: All app-specific outputs
- alb_dns_name, alb_arn
- asg_name
- s3_bucket_name
- rds_endpoint
- cloudwatch_log_group_name
- iam_role_arn
- app_summary

**Kept**: Only core infrastructure outputs
- vpc_id, vpc_cidr
- public_subnet_ids, private_subnet_ids
- nat_gateway_ips, internet_gateway_id
- core_infra_summary

## Validation

✅ Core infrastructure now validates successfully:
```
terraform validate
Success! The configuration is valid.
```

Core infrastructure no longer asks for:
- ~~db_username~~ ❌
- ~~db_password~~ ❌
- ~~instance_type~~ ❌
- ~~ami_id~~ ❌

## Best Practice: Multi-Tier Infrastructure

This architecture follows AWS best practices for multi-tier deployments:

1. **Tier 1 - Foundation**: Core networking (VPC, subnets, gateways)
2. **Tier 2 - Application**: App stack (ALB, compute, database)
3. **Communication**: Foundation exports state, Application imports via data source

Benefits:
- ✅ Clean separation of concerns
- ✅ Independent scaling and updates
- ✅ Reduced blast radius for changes
- ✅ Teams can manage independently
- ✅ Reusable core foundation for multiple apps

## Next Steps

### To Deploy Core Infrastructure:
```bash
cd /Users/ck/c3ops-repos/c3ops-core-infra/iac/preprod
terraform init
terraform plan
terraform apply
```

### To Deploy App Infrastructure:
```bash
cd /Users/ck/c3ops-repos/c3ops-core-infra/c3-app/terraform
terraform init
export TF_VAR_db_password="secure-password"
terraform plan -out=tfplan
./import-resources.sh
terraform apply tfplan
```

---

**Status**: ✅ FIXED  
**Date**: April 14, 2026  
**Architecture**: Properly separated into core (foundation) and app (consumer) tiers
