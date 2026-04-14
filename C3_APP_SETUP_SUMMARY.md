# C3OPS Core Infrastructure with Application Setup - Summary

## What Was Created

### 1. Application Infrastructure Module (`c3-app/terraform/`)

A complete Terraform module for deploying the C3OPS web application with:

**Compute & Networking:**
- Application Load Balancer (ALB) - Distributes HTTP/HTTPS traffic across EC2 instances
- Auto Scaling Group (ASG) - Automatically scales instances (min: 1, max: 3)
- Launch Template - Defines EC2 instance configuration with Node.js/PM2 setup
- 2 Security Groups - ALB and EC2 with appropriate ingress/egress rules

**Database (Optional):**
- RDS MySQL Instance - Managed relational database for application data
- DB Subnet Group - Isolates database in private subnets
- Database Security Group - Restricts access to EC2 instances only

**Storage & Monitoring:**
- S3 Bucket - Stores application artifacts with versioning enabled
- CloudWatch Log Group - Centralized application and system logging
- IAM Role & Instance Profile - EC2 permissions for S3, CloudWatch, and Secrets Manager

### 2. Deployment Configuration (`c3-app/deployment/`)

**buildspec.yml** - AWS CodeBuild specification that:
- Pre-build Phase: Installs npm dependencies, runs linting
- Build Phase: Compiles application (`npm run build`)
- Post-build Phase: Creates deployment bundle with scripts:
  - `deploy.sh` - Deployment automation
  - `health-check.sh` - Application health verification
  - `rollback.sh` - Rollback to previous version
- Uploads artifacts to S3 for deployment

**README.md** - Comprehensive deployment guide with:
- CI/CD pipeline setup instructions
- Build and deployment procedures
- Monitoring and troubleshooting guides
- Security best practices
- Cost optimization tips

### 3. Core Infrastructure Integration (`iac/preprod/`)

Updated preprod environment with:

**app-infra.tf** - Module wrapper that:
- References the c3-app terraform module
- Passes VPC ID, subnet IDs from core infrastructure
- Configures application-specific settings

**variables.tf** - Added application configuration variables:
- `app_name`, `instance_type`, `ami_id`
- ASG sizing: `asg_desired_capacity`, `asg_min_size`, `asg_max_size`
- Database settings: `enable_database`, `db_instance_class`, credentials
- HTTPS configuration: `enable_https`, `certificate_arn`

**outputs.tf** - Added application infrastructure outputs:
- ALB DNS name (application URL)
- ASG name
- S3 bucket name
- RDS endpoint
- CloudWatch log group
- Complete application summary

**terraform.tfvars** - Added default application configuration

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    AWS Account                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              VPC (10.0.0.0/16)                        │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ Public Subnets (ALB)                            │  │  │
│  │  │  - 10.0.1.0/28 (ap-south-2a)                   │  │  │
│  │  │  - 10.0.2.0/28 (ap-south-2b)                   │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │           ↓ (NAT Gateway in 10.0.1.0/28)             │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ Private Subnets (EC2 & RDS)                      │  │  │
│  │  │  - 10.0.3.0/24 (ap-south-2a)                   │  │  │
│  │  │  - 10.0.4.0/24 (ap-south-2b)                   │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │            Load Balancing (ALB)                      │  │
│  │  ├─ HTTP Port 80   → Target Group Port 3000        │  │
│  │  └─ HTTPS Port 443 → Target Group Port 3000        │  │
│  └───────────────────────────────────────────────────────┘  │
│           ↓                                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │            Auto Scaling Group                         │  │
│  │  ├─ Min Size: 1 instance                             │  │
│  │  ├─ Desired: 1 instance                              │  │
│  │  ├─ Max Size: 3 instances                            │  │
│  │  └─ Health Check: ELB (30s interval)                │  │
│  └───────────────────────────────────────────────────────┘  │
│           ↓                                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         EC2 Instances (Amazon Linux 2023)           │  │
│  │  ├─ Instance Type: t3.micro                          │  │
│  │  ├─ IAM Role: EC2 → S3, CloudWatch access           │  │
│  │  ├─ User Data: Node.js 18 + PM2                     │  │
│  │  └─ Application Port: 3000                           │  │
│  └───────────────────────────────────────────────────────┘  │
│           ↓                                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │            Database (RDS MySQL)                      │  │
│  │  ├─ Instance: db.t3.micro                            │  │
│  │  ├─ Storage: 20 GB gp3                              │  │
│  │  ├─ Engine: MySQL 8.0                               │  │
│  │  ├─ Backup: 7-day retention                          │  │
│  │  └─ Multi-AZ: Disabled (preprod)                    │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │     Storage & Monitoring                             │  │
│  │  ├─ S3 Bucket (Artifacts & Assets)                  │  │
│  │  ├─ CloudWatch Logs (7-day retention)               │  │
│  │  └─ CloudWatch Metrics (CPU, Memory, Disk)          │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
c3ops-core-infra/
├── c3-app/
│   ├── terraform/
│   │   ├── main.tf                      # ALB, ASG, RDS, SG, IAM, S3
│   │   ├── variables.tf                 # Input variables
│   │   ├── outputs.tf                   # Output values
│   │   ├── provider.tf                  # Terraform requirements
│   │   ├── user-data.sh                 # EC2 init script
│   │   └── terraform.tfvars             # Default values
│   ├── deployment/
│   │   ├── buildspec.yml                # CodeBuild config
│   │   ├── README.md                    # Deployment guide
│   │   └── scripts/ (generated)
│   └── README.md                        # c3-app overview
│
└── iac/
    ├── modules/
    │   ├── vpc/                         # VPC module (public & private subnets)
    │   └── security/                    # Security groups module
    └── preprod/
        ├── main.tf                      # VPC & Security modules
        ├── app-infra.tf                 # Application infrastructure (NEW)
        ├── variables.tf                 # Updated with app variables
        ├── outputs.tf                   # Updated with app outputs
        ├── terraform.tfvars             # Updated with app config
        └── ...
```

## Key Features

### ✅ Scalability
- Auto Scaling Group with configurable min/max capacity
- Application Load Balancer distributes traffic
- Health checks ensure only healthy instances serve traffic

### ✅ Availability
- Multi-AZ deployment (2 availability zones)
- NAT Gateway for high availability
- RDS with automated backups (7-day retention)

### ✅ Security
- Private subnets for EC2 and RDS
- Security groups with restrictive ingress rules
- IAM role with least privilege permissions
- S3 bucket versioning enabled
- Encrypted storage options

### ✅ Monitoring & Logging
- CloudWatch Logs for application and system logs
- CloudWatch Metrics for performance monitoring
- Health check endpoints
- PM2 process monitoring

### ✅ Deployment Automation
- AWS CodeBuild buildspec.yml for CI/CD
- Automated build and deployment scripts
- Health check and rollback capabilities
- Artifact storage in S3

## Deployment Workflow

### 1. Infrastructure Setup (Terraform)
```bash
cd iac/preprod
terraform init
terraform plan -out=tfplan
terraform apply tfplan
```

### 2. Build Application (CodeBuild)
```bash
aws codebuild start-build --project-name c3-app-build
```

### 3. Deploy to EC2 (CodeDeploy/Manual)
```bash
# Download artifacts from S3
aws s3 cp s3://bucket-name/c3-app-*.tar.gz .
tar -xzf c3-app-*.tar.gz
./deploy/config/deploy.sh
```

### 4. Monitor Application
```bash
aws logs tail /aws/app/c3-app-preprod --follow
pm2 monit
```

## Configuration Examples

### Minimal Setup (Preprod)
```hcl
app_name              = "c3-app"
instance_type         = "t3.micro"
asg_desired_capacity  = 1
asg_min_size          = 1
asg_max_size          = 3
enable_database       = true
enable_https          = false
```

### Production-Ready Setup
```hcl
app_name              = "c3-app"
instance_type         = "t3.small"
asg_desired_capacity  = 2
asg_min_size          = 2
asg_max_size          = 10
enable_database       = true
db_instance_class     = "db.t3.small"
db_allocated_storage  = 100
enable_https          = true
certificate_arn       = "arn:aws:acm:..."
```

## Cost Estimation (Monthly - Preprod)

| Component | Instance Type | Estimated Cost |
|-----------|--------------|-----------------|
| ALB | - | $16.20 |
| EC2 | t3.micro (1-3) | ~$15.00 |
| RDS | db.t3.micro | ~$31.00 |
| NAT Gateway | - | ~$32.00 |
| Data Transfer | Minimal | ~$5.00 |
| S3 & CloudWatch | Minimal | ~$2.00 |
| **Total Monthly** | - | **~$101.20** |

## Next Steps

### Immediate
1. Set AMI ID in terraform.tfvars
2. Deploy infrastructure: `terraform apply`
3. Verify ALB DNS name in outputs
4. Test health check: `curl http://<alb-dns-name>`

### Short-term
1. Set up CodeBuild project for automated builds
2. Configure continuous deployment pipeline
3. Add custom domain and HTTPS certificate
4. Implement database backups to S3

### Medium-term
1. Add CloudWatch alarms for monitoring
2. Implement AWS WAF rules on ALB
3. Enable VPC Flow Logs for network monitoring
4. Set up application autoscaling policies

### Long-term
1. Multi-region deployment
2. Blue-green deployment strategy
3. Database read replicas for performance
4. Content delivery network (CloudFront) for static assets

## Support & Troubleshooting

### Common Issues

**ALB Health Checks Failing**
- Check EC2 instance logs: `tail -f /var/log/user-data.log`
- Verify security group allows ALB → EC2 traffic
- Ensure application is running: `pm2 status`

**Database Connection Issues**
- Verify security group allows EC2 → RDS:3306
- Test connectivity: `mysql -h <endpoint> -u admin -p`
- Check RDS instance status in AWS Console

**Application Won't Start**
- SSH into instance and check: `pm2 logs c3-app`
- Verify dependencies: `npm list`
- Check port availability: `sudo lsof -i :3000`

See [deployment/README.md](c3-app/deployment/README.md) for detailed troubleshooting guides.

## References

- [C3OPS Repository Structure](../ARCHITECTURE.md)
- [Terraform Documentation](https://www.terraform.io/docs)
- [AWS Load Balancing](https://docs.aws.amazon.com/elasticloadbalancing/)
- [AWS Auto Scaling](https://docs.aws.amazon.com/autoscaling/)
- [AWS CodeBuild](https://docs.aws.amazon.com/codebuild/)
