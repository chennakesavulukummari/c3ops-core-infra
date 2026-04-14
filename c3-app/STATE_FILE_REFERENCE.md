# State File Reference & Data Source Integration

## Core Infrastructure State File

**Location**: `/iac/preprod/terraform.tfstate`

The app infrastructure automatically references this state file via:

```hcl
data "terraform_remote_state" "core" {
  backend = "local"
  config = {
    path = "../iac/preprod/terraform.tfstate"
  }
}
```

## Available Outputs from Core Infrastructure

The app infrastructure accesses these values automatically:

### VPC Resources
```hcl
data.terraform_remote_state.core.outputs.vpc_id
data.terraform_remote_state.core.outputs.public_subnet_ids
data.terraform_remote_state.core.outputs.private_subnet_ids
data.terraform_remote_state.core.outputs.vpc_cidr
```

### Network Resources
```hcl
data.terraform_remote_state.core.outputs.nat_gateway_id
data.terraform_remote_state.core.outputs.internet_gateway_id
data.terraform_remote_state.core.outputs.route_table_public_id
data.terraform_remote_state.core.outputs.route_table_private_id
```

### Security Resources
```hcl
data.terraform_remote_state.core.outputs.security_group_default_id
```

## Locals in App Infrastructure

The app module uses locals to reference core state:

```hcl
locals {
  # Automatically pulled from core infrastructure state
  vpc_id              = data.terraform_remote_state.core.outputs.vpc_id
  public_subnet_ids   = data.terraform_remote_state.core.outputs.public_subnet_ids
  private_subnet_ids  = data.terraform_remote_state.core.outputs.private_subnet_ids
}
```

These locals are then used throughout:

```hcl
# ALB uses public subnets
resource "aws_lb" "app" {
  subnets = local.public_subnet_ids
}

# EC2 uses private subnets
resource "aws_autoscaling_group" "app" {
  vpc_zone_identifier = local.private_subnet_ids
}

# RDS uses private subnets
resource "aws_db_subnet_group" "app" {
  subnet_ids = local.private_subnet_ids
}
```

## Existing Resources in App State

Once imported, the app infrastructure state file contains:

### S3 Resources
```
aws_s3_bucket.ui_deployment
aws_s3_bucket_versioning.ui_deployment
aws_s3_bucket_public_access_block.ui_deployment
aws_s3_bucket_policy.ui_deployment
```

### Route53 Resources
```
aws_route53_zone.app_domain
aws_route53_record.app_alb
aws_route53_record.app_cdn
aws_route53_record.app_www
```

### CloudFront Resources
```
aws_cloudfront_distribution.app_ui
aws_cloudfront_origin_access_identity.app_oai
aws_cloudfront_origin_access_control.app_s3
```

### Application Infrastructure Resources
```
aws_lb.app
aws_lb_target_group.app
aws_lb_listener.app_http
aws_lb_listener.app_https (optional)
aws_autoscaling_group.app
aws_launch_template.app
aws_security_group.alb
aws_security_group.ec2
aws_security_group.rds (if enabled)
aws_iam_role.ec2_role
aws_iam_role_policy.s3_access
aws_iam_role_policy.cloudwatch_access
aws_iam_role_policy_attachment.ssm_access
aws_iam_instance_profile.ec2_profile
aws_db_subnet_group.app (if enabled)
aws_db_instance.app (if enabled)
aws_s3_bucket.app_artifacts
aws_s3_bucket_versioning.app_artifacts
aws_cloudwatch_log_group.app
aws_cloudwatch_log_group.cloudfront_logs
```

## Dependency Chain

```
Core Infrastructure State
    ↓
    ├─→ VPC ID
    ├─→ Public Subnets
    └─→ Private Subnets
                ↓
            App Infrastructure
                ↓
        ┌───────┼───────┐
        ↓       ↓       ↓
      ALB     ASG     RDS
      │       │       │
  Uses Public │    Uses Private
  Subnets    Uses Private
              Subnets
```

## Data Retrieval Process

1. **Terraform Plan**:
   ```bash
   terraform init
   # Loads remote state data source
   # Reads core infrastructure outputs
   ```

2. **Validation**:
   ```bash
   terraform validate
   # Verifies state file exists at path
   # Checks output names match references
   ```

3. **Planning**:
   ```bash
   terraform plan
   # Uses core infrastructure values
   # Calculates app infrastructure changes
   ```

4. **Application**:
   ```bash
   terraform apply
   # Creates resources using referenced values
   # Maintains dependency relationships
   ```

## Troubleshooting State References

### Issue: "Error: state file not found"
**Solution**: Ensure core infrastructure is deployed first
```bash
cd ../iac/preprod
terraform apply
cd ../../c3-app/terraform
terraform init
```

### Issue: "Error: output not found"
**Solution**: Check core infrastructure outputs
```bash
cd ../iac/preprod
terraform output
# Verify vpc_id, public_subnet_ids, private_subnet_ids exist
```

### Issue: "Invalid reference to resource"
**Solution**: Verify locals are used, not variables
```hcl
# Correct
vpc_id = local.vpc_id

# Incorrect
vpc_id = var.vpc_id  # This variable doesn't exist anymore
```

### Issue: "State file locked"
**Solution**: Remove lock file and retry
```bash
rm .terraform/terraform.tflock.hcl
terraform apply
```

## State File Management Commands

### View core infrastructure state
```bash
cd ../iac/preprod
terraform state list
terraform state show aws_vpc.main
```

### View app infrastructure state
```bash
cd ../../c3-app/terraform
terraform state list
terraform state show aws_lb.app
```

### Migrate to remote state (production)
```bash
# Create S3 backend
aws s3 mb s3://c3-terraform-state --region ap-south-2

# Create DynamoDB for locks
aws dynamodb create-table \
  --table-name terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region ap-south-2

# Update backend configuration
# Edit app infrastructure/backend.tf and re-initialize
terraform init -migrate-state
```

## References

- [Terraform Remote State Documentation](https://www.terraform.io/language/state/remote)
- [Terraform Data Sources](https://www.terraform.io/language/data-sources)
- [AWS Terraform Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)

---

**Status**: Integration Complete
**Last Updated**: April 13, 2026
