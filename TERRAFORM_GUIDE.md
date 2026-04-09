# C3OPS Core Infrastructure - Terraform Configuration

This repository contains the Terraform configuration for deploying the C3OPS core infrastructure on AWS.

## Project Structure

```
terraform/
├── preprod/                    # Preprod environment configuration
│   ├── provider.tf            # AWS provider configuration
│   ├── variables.tf           # Input variables
│   ├── main.tf                # Main configuration with modules
│   ├── outputs.tf             # Output values
│   └── terraform.tfvars       # Environment-specific values
│
└── modules/
    ├── vpc/                   # VPC module
    │   ├── main.tf            # VPC resources
    │   ├── variables.tf       # Module input variables
    │   └── outputs.tf         # Module outputs
    │
    └── security/              # Security groups module
        ├── main.tf            # Security group resources
        ├── variables.tf       # Module input variables
        └── outputs.tf         # Module outputs
```

## Infrastructure Architecture

### VPC Configuration
- **VPC CIDR**: 10.0.0.0/16
- **Region**: ap-south-2 (Asia Pacific - Mumbai)
- **AZs**: ap-south-2a, ap-south-2b (High Availability)

### Network Tiers

#### Public Tier (2 subnets)
- **Subnets**: 10.0.1.0/24 (AZ-a), 10.0.2.0/24 (AZ-b)
- **Purpose**: Application Load Balancers, Bastion Hosts
- **Route**: Direct to Internet Gateway (IGW)
- **NAT**: Provides outbound internet access for private subnets

#### Private Web Tier (2 subnets)
- **Subnets**: 10.0.11.0/24 (AZ-a), 10.0.12.0/24 (AZ-b)
- **Purpose**: Web servers, application servers
- **Route**: Through NAT Gateway for internet access

#### Private App Tier (2 subnets)
- **Subnets**: 10.0.21.0/24 (AZ-a), 10.0.22.0/24 (AZ-b)
- **Purpose**: Application servers, microservices
- **Route**: Through NAT Gateway for internet access

#### Private DB Tier (2 subnets)
- **Subnets**: 10.0.31.0/24 (AZ-a), 10.0.32.0/24 (AZ-b)
- **Purpose**: RDS databases, ElastiCache
- **Route**: No internet access (VPC internal only)

### Security Components

#### Network Access Control Lists (NACLs)
- **Public NACL**: Allows inbound HTTP (80), HTTPS (443), ephemeral ports
- **Web NACL**: Allows VPC-internal traffic and outbound internet
- **App NACL**: Allows VPC-internal traffic and outbound internet
- **DB NACL**: Allows only VPC-internal communication

#### Security Groups
- **Public SG**: Allows HTTP, HTTPS, SSH from anywhere (restrict SSH in production)
- **Web SG**: Allows HTTP/HTTPS from public SG, SSH from bastion
- **App SG**: Allows traffic from web SG, SSH from bastion
- **DB SG**: Allows MySQL (3306), PostgreSQL (5432), MongoDB (27017) from app SG

#### NAT Gateway
- **Location**: Public subnets (one per AZ for HA)
- **Purpose**: Provides outbound internet access for private subnets

### Monitoring
- **VPC Flow Logs**: Enabled for traffic analysis and troubleshooting
- **Log Group**: `/aws/vpc/flowlogs/c3ops_preprod`
- **Retention**: 7 days

## Prerequisites

### Required Tools
1. **Terraform**: v1.9.5 or higher
   ```bash
   terraform version
   ```

2. **AWS CLI**: v2.x
   ```bash
   aws --version
   ```

3. **AWS Credentials**: Configure AWS credentials
   ```bash
   aws configure
   # AWS Access Key ID: [Your Access Key]
   # AWS Secret Access Key: [Your Secret Key]
   # Default region: ap-south-2
   # Default output format: json
   ```

### AWS Setup
1. Ensure you have access to AWS Account: 225989338000
2. Verify IAM permissions for creating VPC, subnets, security groups, NAT gateways, etc.
3. Create S3 bucket and DynamoDB table for Terraform state (optional but recommended)

## Deployment Steps

### 1. Initialize Terraform
```bash
cd terraform/preprod
terraform init
```

### 2. Validate Configuration
```bash
terraform validate
```

### 3. Format Check
```bash
terraform fmt -check
```

### 4. Plan Deployment
```bash
terraform plan -out=tfplan
```

Review the planned changes carefully.

### 5. Apply Configuration
```bash
terraform apply tfplan
```

Or for interactive approval:
```bash
terraform apply
```

### 6. Verify Deployment
```bash
# Get outputs
terraform output

# Verify resources in AWS
aws ec2 describe-vpcs --region ap-south-2
aws ec2 describe-subnets --region ap-south-2
aws ec2 describe-security-groups --region ap-south-2
```

## Outputs

After successful deployment, the following outputs will be available:

- `vpc_id`: VPC identifier
- `vpc_cidr`: VPC CIDR block
- `public_subnet_ids`: Public subnet identifiers
- `private_web_subnet_ids`: Web tier subnet identifiers
- `private_app_subnet_ids`: App tier subnet identifiers
- `private_db_subnet_ids`: DB tier subnet identifiers
- `internet_gateway_id`: IGW identifier
- `nat_gateway_ips`: Elastic IPs of NAT Gateways
- `security_group_ids`: Security group identifiers

Retrieve outputs:
```bash
terraform output -json
```

## Environment Variables

Optional environment variables:
```bash
# Set AWS Region
export AWS_REGION=ap-south-2

# Enable detailed logging (optional)
export TF_LOG=DEBUG

# Use specific AWS profile
export AWS_PROFILE=c3ops-preprod
```

## State Management

Terraform state is stored in the backend specified in `provider.tf`. By default, it uses S3 backend:
- **Bucket**: `c3ops-terraform-state`
- **Key**: `c3ops_preprod/terraform.tfstate`
- **Region**: `ap-south-2`
- **Encryption**: Enabled
- **Lock Table**: `terraform-locks` (DynamoDB)

### Create S3 Backend (if not exists)
```bash
# Create S3 bucket
aws s3api create-bucket \
  --bucket c3ops-terraform-state \
  --region ap-south-2 \
  --create-bucket-configuration LocationConstraint=ap-south-2

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket c3ops-terraform-state \
  --versioning-configuration Status=Enabled

# Enable encryption
aws s3api put-bucket-encryption \
  --bucket c3ops-terraform-state \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'

# Create DynamoDB table for state locking
aws dynamodb create-table \
  --table-name terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region ap-south-2
```

## Customization

To customize the infrastructure, edit `terraform.tfvars`:

```hcl
# Change VPC CIDR
vpc_cidr = "10.0.0.0/16"

# Change subnet CIDRs
public_subnet_cidrs = ["10.0.1.0/24", "10.0.2.0/24"]
private_web_subnet_cidrs = ["10.0.11.0/24", "10.0.12.0/24"]
private_app_subnet_cidrs = ["10.0.21.0/24", "10.0.22.0/24"]
private_db_subnet_cidrs = ["10.0.31.0/24", "10.0.32.0/24"]

# Disable NAT Gateway
enable_nat_gateway = false

# Disable VPC Flow Logs
enable_flow_logs = false

# Add custom tags
tags = {
  Owner       = "Your-Name"
  CostCenter  = "Your-Cost-Center"
  Environment = "preprod"
}
```

## Scaling & HA

This infrastructure is designed for high availability:
- **Multi-AZ**: Resources spread across 2 availability zones
- **NAT Gateway**: One per AZ for redundant outbound connectivity
- **Route Tables**: Separate per tier for granular routing control

## Security Best Practices

1. **Restrict SSH Access**: Update public security group to allow SSH only from specific IPs
   ```bash
   # Bastion security group should only allow SSH from your office IP
   ```

2. **Enable VPC Flow Logs**: Monitor traffic patterns
3. **Regular Backups**: Enable automated snapshots for critical resources
4. **Encryption**: Enable encryption at rest and in transit
5. **Compliance**: Tag resources for compliance tracking

## Troubleshooting

### Terraform Plan Issues
```bash
# Validate syntax
terraform validate

# Format issues
terraform fmt -recursive

# Check state consistency
terraform refresh
```

### AWS API Errors
```bash
# Check AWS credentials
aws sts get-caller-identity

# Verify IAM permissions
aws iam get-user
```

### State Issues
```bash
# Remove local state and re-initialize
rm -rf .terraform
rm terraform.tfstate*
terraform init
```

## CI/CD Integration

### AWS CodeBuild

Use `buildspec.yml` for automated deployments via AWS CodeBuild:

```yaml
version: 0.2

phases:
  pre_build:
    commands:
      - cd terraform/preprod
      - terraform init
      - terraform validate
      - terraform fmt -check
  
  build:
    commands:
      - terraform plan -out=tfplan
      - terraform apply tfplan
```

### GitHub Actions

Example workflow for GitHub Actions:

```yaml
name: Deploy Infrastructure

on: [push]

jobs:
  terraform:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: hashicorp/setup-terraform@v2
        with:
          terraform_version: 1.9.5
      - run: cd terraform/preprod && terraform init
      - run: terraform plan -out=tfplan
      - run: terraform apply tfplan
```

## Cost Estimation

Estimated monthly costs (preprod environment):
- NAT Gateway: ~$32 (1 per AZ)
- Data transfer: Variable
- VPC: Free
- Subnets: Free
- Route tables: Free

For cost estimation:
```bash
terraform plan -out=tfplan
# Review the resources being created
```

## Cleanup & Destruction

⚠️ **Warning**: This will delete all infrastructure

```bash
# Plan destruction
terraform plan -destroy

# Destroy infrastructure
terraform destroy

# Approve destruction
terraform destroy -auto-approve
```

## Support & Documentation

- **Terraform Documentation**: https://www.terraform.io/docs
- **AWS Provider**: https://registry.terraform.io/providers/hashicorp/aws/latest/docs
- **C3OPS Documentation**: [Internal Wiki]

## License

© 2024 C3OPS. All rights reserved.

---

**Last Updated**: April 2024
**Terraform Version**: 1.9.5+
**AWS Region**: ap-south-2
**Environment**: preprod
