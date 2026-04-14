# C3OPS Application Deployment Guide

## Overview
This directory contains the deployment configuration for the C3OPS application using AWS CodeBuild and CodeDeploy.

## Project Structure

```
c3-app/
├── terraform/              # Application infrastructure as code
│   ├── main.tf            # Main infrastructure resources
│   ├── variables.tf       # Input variables
│   ├── outputs.tf         # Output values
│   ├── provider.tf        # AWS provider configuration
│   ├── user-data.sh       # EC2 initialization script
│   └── terraform.tfvars   # Default variable values
│
└── deployment/            # CI/CD and deployment configuration
    ├── buildspec.yml      # AWS CodeBuild specification
    ├── README.md          # This file
    └── scripts/           # Deployment helper scripts
        ├── deploy.sh      # Deployment script
        ├── health-check.sh # Health check script
        └── rollback.sh    # Rollback script
```

## Application Infrastructure

The Terraform configuration creates the following resources:

### Networking & Load Balancing
- **Application Load Balancer (ALB)** - Distributes traffic across EC2 instances
- **Target Group** - Routes traffic to healthy instances
- **Security Groups** - Controls inbound/outbound traffic

### Compute
- **Launch Template** - EC2 configuration template with user data
- **Auto Scaling Group (ASG)** - Automatically scales instances based on demand
- **IAM Role & Instance Profile** - EC2 permissions and S3 access

### Database (Optional)
- **RDS MySQL Instance** - Managed database for the application
- **DB Subnet Group** - Database placement in private subnets

### Storage & Logging
- **S3 Bucket** - Application artifacts and assets
- **CloudWatch Log Group** - Application and system logs

## Deployment Pipeline

### Build Phase (CodeBuild)

1. **Pre-build**
   - Install Node.js dependencies
   - Run linting checks
   - Validate code quality

2. **Build**
   - Execute `npm run build`
   - Generate production artifacts (dist/ directory)

3. **Post-build**
   - Create deployment bundle with app and scripts
   - Upload artifacts to S3
   - Generate health check and deployment scripts

### Deploy Phase (CodeDeploy/Manual)

1. Download deployment bundle from S3
2. Extract and install dependencies
3. Start application via PM2
4. Run health checks
5. Monitor logs

### Rollback

If deployment fails or health checks don't pass:
1. Stop current application instances
2. Restore previous version from backup
3. Re-start application

## Environment Variables

### Required Environment Variables
- `AWS_REGION` - AWS region (default: ap-south-2)
- `NODE_ENV` - Node environment (default: production)
- `S3_BUCKET_NAME` - S3 bucket for artifacts
- `DB_PASSWORD` - Database password (from Parameter Store)

### Optional Environment Variables
- `HTTPS_ENABLED` - Enable HTTPS (boolean)
- `CERTIFICATE_ARN` - ACM certificate ARN for HTTPS
- `CUSTOM_DOMAIN` - Custom domain name

## Deployment Instructions

### 1. Prerequisites

```bash
# Install Terraform
brew install terraform

# Configure AWS credentials
aws configure

# Install Node.js
node --version  # Ensure v18+
npm --version   # Ensure v9+
```

### 2. Deploy Infrastructure

```bash
cd c3-app/terraform

# Initialize Terraform
terraform init

# Plan infrastructure
terraform plan -out=tfplan

# Apply infrastructure
terraform apply tfplan
```

### 3. Set up CodeBuild Project

```bash
# Create a CodeBuild project
aws codebuild create-project \
  --name c3-app-build \
  --source type=CODECOMMIT,location=https://git-codecommit.ap-south-2.amazonaws.com/v1/repos/c3ops-website \
  --artifacts type=S3,location=c3-app-preprod-artifacts-ACCOUNT_ID \
  --service-role arn:aws:iam::ACCOUNT_ID:role/codebuild-role \
  --environment type=LINUX_CONTAINER,image=aws/codebuild/standard:7.0,computeType=BUILD_GENERAL1_MEDIUM
```

### 4. Trigger Build

```bash
# Start a build
aws codebuild start-build \
  --project-name c3-app-build \
  --source-version main
```

### 5. Deploy to EC2

```bash
# SSH into an EC2 instance
aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=c3-app-instance" \
  --query 'Reservations[0].Instances[0].PublicIpAddress'

# Download and run deployment script
aws s3 cp s3://c3-app-preprod-artifacts-ACCOUNT_ID/c3-app-*.tar.gz .
tar -xzf c3-app-*.tar.gz
./deploy/config/deploy.sh
```

## Monitoring & Troubleshooting

### View Application Logs

```bash
# CloudWatch Logs
aws logs tail /aws/app/c3-app-preprod --follow

# PM2 Logs on EC2
pm2 logs c3-app
pm2 monit
```

### Health Checks

```bash
# Manual health check
./deploy/config/health-check.sh

# ALB health check
aws elbv2 describe-target-health \
  --target-group-arn arn:aws:elasticloadbalancing:REGION:ACCOUNT_ID:targetgroup/c3-app-tg/HASH
```

### Common Issues

#### Application Won't Start
```bash
# Check logs
pm2 logs c3-app
tail -f /var/log/user-data.log

# Verify dependencies
npm list

# Check port availability
sudo lsof -i :3000
```

#### Database Connection Issues
```bash
# Test database connectivity
mysql -h ENDPOINT -u admin -p

# Check security group rules
aws ec2 describe-security-groups \
  --group-ids sg-xxxxxx
```

#### Deployment Failures
```bash
# Rollback to previous version
./deploy/config/rollback.sh

# Check build logs
aws codebuild batch-get-builds \
  --ids BUILD_ID \
  --query 'builds[0].logs'
```

## Performance Tuning

### ASG Configuration
```hcl
# Adjust in terraform.tfvars
asg_desired_capacity = 2
asg_min_size         = 2
asg_max_size         = 10
```

### RDS Configuration
```hcl
# Adjust database size
db_instance_class    = "db.t3.small"
db_allocated_storage = 50
```

### ALB Health Check
```hcl
# Modify health check settings
health_check {
  healthy_threshold   = 2
  unhealthy_threshold = 3
  timeout             = 5
  interval            = 30
  path                = "/"
  matcher             = "200-399"
}
```

## Cost Optimization

- Use smaller instance types in non-production
- Enable autoscaling to reduce idle capacity
- Schedule instances to turn off during off-hours
- Use RDS Multi-AZ only for production

## Security Best Practices

- Enable HTTPS/SSL for production
- Use AWS Secrets Manager for sensitive data
- Enable VPC Flow Logs for traffic monitoring
- Regular security group audits
- Implement WAF rules on ALB
- Use IMDSv2 for EC2 metadata
- Enable S3 encryption for artifacts

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Build and Deploy

on:
  push:
    branches: [main, develop]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build with CodeBuild
        run: |
          aws codebuild start-build \
            --project-name c3-app-build \
            --source-version ${{ github.sha }}
```

## Support & References

- [AWS CodeBuild Documentation](https://docs.aws.amazon.com/codebuild/)
- [AWS CodeDeploy Documentation](https://docs.aws.amazon.com/codedeploy/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/nodejs-performance/)
