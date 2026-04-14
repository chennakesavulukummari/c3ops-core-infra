# C3OPS Application Infrastructure - Deployment Guide

## Overview

This guide explains how to integrate existing AWS resources (CloudFront, Route53, S3) into Terraform and deploy the complete application infrastructure on top of the core infrastructure.

## Existing AWS Resources

The following resources were created manually and need to be imported into Terraform state:

| Resource | ID/Name | Details |
|----------|---------|---------|
| **CloudFront Distribution** | E1P2QRT0GYEL2J | UI/Static content distribution |
| **Route53 Hosted Zone** | Z099400737QOK0UZ3T989 | cloudcostconsole.com |
| **S3 Bucket** | c3cloudcostconsole | UI code deployment |
| **Domain** | cloudcostconsole.com | Primary application domain |
| **Region** | ap-south-2 | Asia Pacific (Mumbai) |

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        INTERNET (Users)                              │
│                                                                       │
│  Users access: cloudcostconsole.com / api.cloudcostconsole.com       │
└────────────────────────────────────────┬──────────────────────────────┘
                                         │
                    ┌────────────────────┴─────────────────────┐
                    │                                          │
           ┌────────▼─────────────┐          ┌────────────────▼──────┐
           │  Route53 (DNS)       │          │  Route53 (DNS)        │
           │  cloudcostconsole.   │          │  api.cloudcostconsole │
           │  com (ALIAS → CDN)   │          │  .com (ALIAS → ALB)   │
           └────────┬─────────────┘          └────────┬───────────────┘
                    │                                  │
           ┌────────▼────────────────┐       ┌────────▼──────────┐
           │  CloudFront (CDN)       │       │  ALB (Load        │
           │  E1P2QRT0GYEL2J         │       │  Balancer)        │
           │                         │       │                   │
           │  - Caching              │       │  - HTTP/HTTPS     │
           │  - Security             │       │  - Traffic dist   │
           │  - Global CDN           │       │  - Health check   │
           └────────┬────────────────┘       └────────┬──────────┘
                    │                                 │
           ┌────────▼─────────────┐        ┌────────┴───────────┐
           │  S3 (UI Bucket)      │        │  Auto Scaling      │
           │  c3cloudcostconsole  │        │  Group             │
           │                      │        │                    │
           │  - React App         │        │  - Min: 1 EC2      │
           │  - Static Assets     │        │  - Max: 3 EC2      │
           │  - Versioning        │        │  - t3.micro        │
           └──────────────────────┘        │  - Node.js/PM2     │
                                           └────────┬───────────┘
                                                    │
                                           ┌────────▼──────────┐
                                           │  Private Subnets  │
                                           │  (Core Infra VPC) │
                                           │                   │
                                           │  - EC2 instances  │
                                           │  - RDS (optional) │
                                           └───────────────────┘
```

## Prerequisites

1. **AWS Account**: With appropriate IAM permissions
2. **Terraform**: v1.9.5+ installed
3. **AWS CLI**: Configured with credentials for ap-south-2
4. **Core Infrastructure**: Already deployed (VPC, NAT Gateway, Subnets)
5. **Existing Resources**: CloudFront, Route53, S3 bucket created

## Deployment Steps

### Step 1: Initialize Terraform with State File Reference

Navigate to the app infrastructure directory:

```bash
cd /Users/ck/c3ops-repos/c3ops-core-infra/c3-app/terraform
```

The `provider.tf` includes a data source for the core infrastructure state:

```hcl
data "terraform_remote_state" "core" {
  backend = "local"
  config = {
    path = "../iac/preprod/terraform.tfstate"
  }
}
```

This automatically references:
- `vpc_id` from core infrastructure
- `public_subnet_ids` for ALB
- `private_subnet_ids` for EC2/RDS

### Step 2: Review and Update Configuration

Update `terraform.tfvars` with your settings:

```bash
cat terraform.tfvars
```

Key settings to verify:

```hcl
aws_region  = "ap-south-2"
app_name    = "c3-app"
environment = "preprod"

# EC2 Configuration
instance_type        = "t3.micro"
asg_desired_capacity = 1
asg_min_size         = 1
asg_max_size         = 3

# Database Configuration
enable_database      = true
db_instance_class    = "db.t3.micro"
db_username          = "admin"
# db_password - Set via environment variable

# HTTPS Configuration
enable_https = false
# certificate_arn = "arn:aws:acm:..." when HTTPS is needed
```

### Step 3: Set Sensitive Variables

Set the database password via environment variable (recommended for sensitive data):

```bash
# Option 1: Export environment variable
export TF_VAR_db_password="your-secure-password"

# Option 2: Use AWS Secrets Manager (recommended for production)
aws secretsmanager create-secret --name c3-app-db-password \
  --secret-string "your-secure-password" \
  --region ap-south-2
```

### Step 4: Initialize Terraform

```bash
terraform init
```

This will:
- Download AWS provider
- Initialize local backend
- Load remote state data source (core infrastructure)

### Step 5: Import Existing Resources

Make the import script executable:

```bash
chmod +x import-resources.sh
```

Run the import script:

```bash
./import-resources.sh
```

This imports:
- S3 bucket (c3cloudcostconsole)
- Route53 hosted zone (cloudcostconsole.com)
- CloudFront distribution (E1P2QRT0GYEL2J)
- S3 bucket policies and versioning
- CloudFront OAC (Origin Access Control)

**Note**: Some resources may need manual ID lookups if not standard names.

### Step 6: Validate Configuration

```bash
terraform validate
```

Should output: `Success! The configuration is valid.`

### Step 7: Plan Infrastructure Changes

```bash
terraform plan -out=tfplan
```

Review the plan to ensure:
- ✓ ALB references correct subnets from core infrastructure
- ✓ EC2 instances placed in private subnets
- ✓ RDS database in private subnets (if enabled)
- ✓ Security groups allow proper traffic flow
- ✓ CloudFront and Route53 records created correctly
- ✓ IAM roles and policies applied

### Step 8: Apply Infrastructure

```bash
terraform apply tfplan
```

This creates:

**Compute**:
- Application Load Balancer (ALB)
- Target Group with health checks
- Auto Scaling Group (1-3 instances)
- Launch Template with Node.js/PM2

**Database** (if enabled):
- RDS MySQL instance
- DB subnet group
- Database security group

**Networking**:
- Route53 DNS records
  - `api.cloudcostconsole.com` → ALB
  - `cloudcostconsole.com` → CloudFront
  - `www.cloudcostconsole.com` → CloudFront

**CDN**:
- CloudFront distribution for static content
- Origin Access Control (OAC) for S3
- S3 bucket policy for CloudFront

**Monitoring**:
- CloudWatch log groups
- Application logs to `/aws/ec2/c3-app-logs`
- ALB access logs

**Security**:
- Security groups (ALB, EC2, RDS)
- IAM role with S3 and CloudWatch permissions
- Least privilege principle applied

### Step 9: Verify Deployment

Check outputs:

```bash
terraform output

# Get specific outputs
terraform output -raw alb_dns_name
terraform output -raw cloudfront_distribution_id
terraform output -raw route53_zone_id
```

### Step 10: Access Application

**Via CloudFront (Static Content)**:
```
https://cloudcostconsole.com
https://www.cloudcostconsole.com
```

**Via ALB (API/Backend)**:
```
http://api.cloudcostconsole.com/
```

**ALB Direct Access** (for testing):
```bash
terraform output -raw alb_dns_name
# curl http://<alb-dns-name>
```

## Architecture Components

### Application Load Balancer (ALB)
- **Type**: Application Layer 7
- **Subnets**: Public subnets from core infrastructure
- **Port**: 80 (HTTP)
- **Health Check**: Every 30 seconds on port 3000
- **Sticky Sessions**: Enabled (24 hours)

### Auto Scaling Group (ASG)
- **Subnets**: Private subnets from core infrastructure
- **Instance Type**: t3.micro (configurable)
- **Min/Max/Desired**: 1/3/1 (configurable)
- **Health Check Type**: ELB
- **Health Check Grace Period**: 300 seconds

### Launch Template
- **AMI**: Amazon Linux 2023 (configurable)
- **User Data**: 
  - Installs Node.js 18+
  - Installs npm dependencies
  - Installs PM2 process manager
  - Starts application server on port 3000

### RDS Database
- **Engine**: MySQL 8.0.35
- **Instance Class**: db.t3.micro (configurable)
- **Storage**: 20 GB (configurable)
- **Subnet Group**: Private subnets only
- **Backup Retention**: 7 days
- **Encryption**: Enabled

### CloudFront Distribution
- **S3 Origin**: c3cloudcostconsole bucket
- **ALB Origin**: api.cloudcostconsole.com
- **Default Behavior**: S3 (static content)
- **Path Behavior**: /api/* → ALB (dynamic content)
- **Caching**: 1 hour for static, 0 for API
- **SSL/TLS**: CloudFront default certificate (HTTPS available)

### Route53 Hosted Zone
- **Zone**: cloudcostconsole.com
- **Records**:
  - `cloudcostconsole.com` → CloudFront (ALIAS)
  - `www.cloudcostconsole.com` → CloudFront (ALIAS)
  - `api.cloudcostconsole.com` → ALB (ALIAS)

## State File Management

### Local State
The app infrastructure uses local backend by default for development:
```bash
terraform.tfstate
terraform.tfstate.backup
```

### Remote State (Recommended for Production)
To use S3 backend:

1. Create backend config file (`backend-config.hcl`):
```hcl
bucket         = "c3-terraform-state"
key            = "c3-app/terraform.tfstate"
region         = "ap-south-2"
encrypt        = true
dynamodb_table = "terraform-locks"
```

2. Reinitialize:
```bash
terraform init -backend-config=backend-config.hcl -reconfigure
```

## Troubleshooting

### ALB Health Check Failing
```bash
# SSH into instance
aws ec2-instance-connect open-tunnel --target <instance-id>

# Check application
curl localhost:3000

# Check logs
pm2 logs app
tail -f /var/log/cloud-init-output.log
```

### Database Connection Error
```bash
# Get RDS endpoint
terraform output -raw rds_endpoint

# Test connection
mysql -h <rds-endpoint> -u admin -p

# Check security group
aws ec2 describe-security-groups --group-ids <rds-sg-id>
```

### CloudFront Issues
```bash
# Invalidate cache
aws cloudfront create-invalidation \
  --distribution-id E1P2QRT0GYEL2J \
  --paths "/*"

# Check distribution
aws cloudfront get-distribution --id E1P2QRT0GYEL2J
```

### Route53 DNS Resolution
```bash
# Check DNS records
dig cloudcostconsole.com
dig api.cloudcostconsole.com
nslookup cloudcostconsole.com

# Verify hosted zone
aws route53 list-hosted-zones
aws route53 list-resource-record-sets \
  --hosted-zone-id Z099400737QOK0UZ3T989
```

## Security Best Practices

✅ **Implemented**:
- ALB in public subnets with security group
- EC2 in private subnets (no direct internet access)
- RDS in private subnets (no direct internet access)
- Security groups with least privilege rules
- IAM role with specific S3 and CloudWatch permissions
- CloudFront OAC for S3 bucket access
- Encryption for RDS and S3
- VPC Flow Logs for monitoring

⚠️ **To Configure**:
- ACM certificate for HTTPS
- WAF (Web Application Firewall) rules
- CloudTrail for audit logging
- Secrets Manager for database credentials
- VPC endpoints for private service access

## Cost Optimization

| Resource | Monthly Cost (Estimate) |
|----------|-------------------------|
| ALB | $16.20 |
| EC2 (t3.micro × 1) | $7.29 |
| RDS (db.t3.micro) | $30 |
| CloudFront | Pay per GB transferred |
| Route53 | $0.50 per zone |
| **Total** | **~$54** |

## Next Steps

1. **Enable HTTPS**:
   ```bash
   # Request ACM certificate
   aws acm request-certificate \
     --domain-name cloudcostconsole.com \
     --validation-method DNS
   
   # Update variables
   enable_https = true
   certificate_arn = "arn:aws:acm:..."
   ```

2. **Setup CodeBuild Pipeline**:
   - Create CodeBuild project
   - Connect to Git repository
   - Trigger builds on code push

3. **Configure Auto Scaling**:
   - Add CPU-based scaling policies
   - Monitor with CloudWatch
   - Set up SNS alerts

4. **Enable Monitoring**:
   - CloudWatch dashboards
   - Application Performance Monitoring (APM)
   - Log aggregation (CloudWatch Insights)

## Files Included

| File | Purpose |
|------|---------|
| `main.tf` | ALB, ASG, RDS, Security Groups, IAM |
| `variables.tf` | Input variables for configuration |
| `outputs.tf` | Output values (DNS, IDs, endpoints) |
| `provider.tf` | Terraform version, remote state reference |
| `existing-resources.tf` | CloudFront, Route53, S3 resources |
| `terraform.tfvars` | Default configuration values |
| `user-data.sh` | EC2 initialization script |
| `import-resources.sh` | Script to import existing AWS resources |

## Support

For issues or questions:
1. Check Terraform logs: `TF_LOG=DEBUG terraform plan`
2. Review AWS CloudTrail events
3. Check application logs in CloudWatch
4. Verify security group rules
5. Test connectivity from EC2 to RDS

---

**Last Updated**: April 13, 2026
**Version**: 1.0
**Status**: Ready for Deployment
