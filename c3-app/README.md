# C3OPS Application Infrastructure

This directory contains the application-specific infrastructure and deployment configuration for C3OPS built on top of the core infrastructure (VPC, NAT Gateway, etc.).

## Directory Structure

```
c3-app/
├── terraform/                      # Infrastructure as Code
│   ├── main.tf                     # Application resources (ALB, ASG, RDS, S3, Security Groups)
│   ├── variables.tf                # Input variables for customization
│   ├── outputs.tf                  # Output values for downstream consumption
│   ├── provider.tf                 # Terraform provider requirements
│   ├── user-data.sh                # EC2 initialization script
│   └── terraform.tfvars            # Default variable values
│
└── deployment/                     # CI/CD and Deployment
    ├── buildspec.yml               # AWS CodeBuild specification
    ├── README.md                   # Deployment and monitoring guide
    └── scripts/                    # Deployment helper scripts (generated during build)
        ├── deploy.sh               # Deployment script
        ├── health-check.sh         # Application health check
        └── rollback.sh             # Rollback to previous version
```

## Quick Start

### 1. Prerequisites

```bash
# Ensure AWS credentials are configured
aws configure

# Verify Terraform is installed
terraform version

# Verify Node.js is installed
node --version  # v18+ required
npm --version   # v9+ required
```

### 2. Deploy Application Infrastructure

```bash
# Navigate to preprod environment
cd ../iac/preprod

# Initialize Terraform (includes c3-app module)
terraform init

# Preview infrastructure changes
terraform plan -out=tfplan

# Apply infrastructure
terraform apply tfplan
```

### 3. Configure Variables

Create/update `terraform.tfvars` in the preprod directory with:

```hcl
# Application configuration
app_name              = "c3-app"
instance_type         = "t3.micro"
asg_desired_capacity  = 1

# Database (optional)
enable_database       = true
db_username           = "admin"
# db_password         = "your-secure-password"  # Use -var or env vars

# HTTPS (optional)
enable_https          = false
```

### 4. Build & Deploy Application

See [deployment/README.md](deployment/README.md) for detailed CI/CD setup and deployment procedures.

## Infrastructure Components

### Load Balancing
- **Application Load Balancer (ALB)** - Distributes HTTP/HTTPS traffic
- **Target Group** - Routes requests to healthy EC2 instances
- **ALB Security Group** - Controls ALB inbound/outbound traffic

### Compute
- **Launch Template** - Configures EC2 instances with user data script
- **Auto Scaling Group** - Automatically scales instances (1-3) based on demand
- **EC2 Security Group** - Manages EC2 instance network access

### Database (Optional)
- **RDS MySQL** - Managed relational database
- **DB Subnet Group** - Isolates database in private subnets
- **RDS Security Group** - Restricts database access

### Storage & Monitoring
- **S3 Bucket** - Stores application artifacts and assets
- **CloudWatch Logs** - Centralizes application and system logs
- **IAM Role** - Provides EC2 permissions (S3, Secrets Manager, CloudWatch)

## Key Variables

### Required
- `vpc_id` - VPC ID from core infrastructure
- `public_subnet_ids` - Subnets for ALB
- `private_subnet_ids` - Subnets for EC2 and RDS
- `ami_id` - AMI ID for EC2 instances (Amazon Linux 2023)
- `db_username` & `db_password` - Database credentials

### Optional
- `instance_type` (default: `t3.micro`)
- `asg_*` - Auto Scaling Group sizing
- `enable_database` (default: `true`)
- `enable_https` (default: `false`)

## Terraform Outputs

Key outputs for integration with other systems:

```bash
# Get outputs after terraform apply
terraform output alb_dns_name       # Application URL
terraform output asg_name           # Auto Scaling Group name
terraform output s3_bucket_name     # Artifacts bucket
terraform output rds_endpoint       # Database endpoint
terraform output app_summary        # Complete summary
```

## Deployment Workflow

### Using CodeBuild

```bash
# Create CodeBuild project
aws codebuild create-project \
  --name c3-app-build \
  --source type=CODECOMMIT,location=<your-repo> \
  --artifacts type=S3,location=<artifacts-bucket>

# Trigger build
aws codebuild start-build --project-name c3-app-build
```

### Manual Deployment

```bash
# SSH into EC2 instance
ssh -i your-key.pem ec2-user@<instance-ip>

# Download deployment bundle
aws s3 cp s3://bucket-name/c3-app-*.tar.gz .

# Extract and deploy
tar -xzf c3-app-*.tar.gz
./deploy/config/deploy.sh

# Check application status
pm2 logs c3-app
pm2 monit
```

## Monitoring

### CloudWatch Logs
```bash
# Tail logs in real-time
aws logs tail /aws/app/c3-app-preprod --follow

# View specific time range
aws logs tail /aws/app/c3-app-preprod \
  --start-time 2 hours ago
```

### ALB Health
```bash
# Check target health
aws elbv2 describe-target-health \
  --target-group-arn <target-group-arn>
```

### EC2 Metrics
```bash
# Get CPU utilization
aws cloudwatch get-metric-statistics \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 300 \
  --statistics Average
```

## Troubleshooting

### Application Won't Start
```bash
# Check user-data logs
tail -f /var/log/user-data.log

# Check PM2 status
pm2 status
pm2 logs c3-app

# Verify port binding
sudo lsof -i :3000
```

### Database Connection Failed
```bash
# Test connectivity
mysql -h <rds-endpoint> -u admin -p

# Check security group rules
aws ec2 describe-security-groups --group-ids <sg-id>
```

### ALB Health Checks Failing
```bash
# Check instance logs
ssh into instance and run:
curl http://localhost:3000/
tail -f /var/log/app.log

# Verify security group allows ALB -> EC2 traffic
```

## Cost Optimization

- **Instance Type**: Use `t3.micro` for development/testing
- **Autoscaling**: Adjust `asg_*` variables for your load patterns
- **Database**: Disable with `enable_database = false` if not needed
- **Backups**: RDS retention set to 7 days (adjust as needed)

## Security Best Practices

- ✅ EC2 instances in private subnets (NAT for outbound)
- ✅ ALB security group allows only 80/443
- ✅ EC2 security group allows only from ALB
- ✅ RDS in private subnets with restricted security group
- ✅ S3 bucket versioning enabled
- ✅ Encrypted CloudWatch logs
- ✅ IAM role with minimal permissions

### Recommended Enhancements
- [ ] Enable HTTPS with ACM certificate
- [ ] Add WAF rules to ALB
- [ ] Enable RDS Multi-AZ for production
- [ ] Implement database backups to S3
- [ ] Add VPC Flow Logs
- [ ] Enable AWS Secrets Manager for sensitive data

## Integration with Core Infrastructure

This module is designed to work alongside the core infrastructure:

```
c3ops-core-infra/
├── iac/
│   ├── modules/
│   │   ├── vpc/          ← Core networking
│   │   └── security/     ← Security groups
│   └── preprod/
│       ├── main.tf       ← VPC module
│       ├── app-infra.tf  ← App infrastructure module ← YOU ARE HERE
│       └── ...
└── c3-app/
    ├── terraform/        ← Application resources
    └── deployment/       ← Build and deployment config
```

The `app-infra.tf` in the preprod environment references this module and passes:
- VPC ID from core infrastructure
- Public/private subnet IDs
- All application-specific variables

## Commands Reference

```bash
# Plan infrastructure
terraform plan -out=tfplan

# Apply infrastructure
terraform apply tfplan

# Destroy infrastructure (use with caution)
terraform destroy

# Get specific output
terraform output alb_dns_name

# Format code
terraform fmt -recursive

# Validate syntax
terraform validate

# Show state
terraform show

# Refresh state
terraform refresh
```

## Files Reference

| File | Purpose |
|------|---------|
| `main.tf` | ALB, ASG, RDS, Security Groups, IAM, S3, CloudWatch |
| `variables.tf` | Input variable definitions |
| `outputs.tf` | Output value definitions |
| `provider.tf` | Terraform version and provider requirements |
| `user-data.sh` | EC2 initialization script (Node.js, PM2 setup) |
| `terraform.tfvars` | Default variable values |

## Related Documentation

- [C3OPS Architecture](../../ARCHITECTURE.md)
- [Terraform Guide](../../TERRAFORM_GUIDE.md)
- [Deployment Guide](deployment/README.md)
- [Infrastructure Summary](../../INFRASTRUCTURE_SUMMARY.md)

## Support

For issues or questions:
1. Check the deployment README for CI/CD and troubleshooting
2. Review CloudWatch logs for application errors
3. Verify security group rules for connectivity issues
4. Consult AWS documentation for service-specific help

## Next Steps

1. **Configure CI/CD Pipeline** - Set up CodeBuild and CodePipeline
2. **Set Up Monitoring** - Create CloudWatch alarms for key metrics
3. **Enable HTTPS** - Add ACM certificate and update ALB listener
4. **Implement Backups** - Configure automated database backups
5. **Security Hardening** - Add WAF rules and VPC Flow Logs
