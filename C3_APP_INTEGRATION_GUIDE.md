# C3-App Integration Complete ✓

## Project Structure

```
c3ops-core-infra/
├── iac/
│   └── preprod/              # Core infrastructure (VPC, NAT, subnets)
│       ├── main.tf
│       ├── app-infra.tf      # NEW: App infrastructure module wrapper
│       ├── variables.tf      # UPDATED: +12 app variables
│       ├── outputs.tf        # UPDATED: +9 app outputs
│       └── terraform.tfvars  # UPDATED: App configuration
│
└── c3-app/                   # Application-specific infrastructure & code
    ├── terraform/            # App infrastructure module
    │   ├── main.tf           # ALB, ASG, RDS, Security Groups, IAM, S3, CloudWatch
    │   ├── variables.tf      # 24+ configurable inputs
    │   ├── outputs.tf        # 16 output values
    │   ├── provider.tf       # Terraform requirements
    │   ├── user-data.sh      # EC2 initialization script
    │   └── terraform.tfvars  # Default values
    │
    ├── deployment/           # CI/CD configuration
    │   ├── buildspec.yml     # AWS CodeBuild 4-phase pipeline
    │   └── README.md         # Deployment procedures & troubleshooting
    │
    ├── app/                  # Application source code (1.2GB)
    │   ├── package.json      # React 18 + Express dependencies
    │   ├── src/              # React frontend components
    │   ├── server/           # Express backend (index.js)
    │   ├── dist/             # Built production assets
    │   ├── lambda/           # AWS Lambda functions
    │   ├── terraform/        # Original app infrastructure
    │   └── node_modules/     # Installed npm packages
    │
    └── README.md             # App infrastructure overview
```

## Key Integration Points

### 1. **Core Infrastructure → App Infrastructure**
- **File**: `iac/preprod/app-infra.tf`
- **Purpose**: Calls c3-app/terraform module with VPC resources
- **Passes**: vpc_id, public_subnet_ids, private_subnet_ids
- **Gets**: ALB DNS name, RDS endpoint, S3 bucket name

### 2. **Application Variables**
- **File**: `iac/preprod/variables.tf`
- **Added**: 12+ app-specific variables (instance_type, db_password, asg_min_size, etc.)
- **Scope**: Configurable from preprod terraform.tfvars

### 3. **Application Outputs**
- **File**: `iac/preprod/outputs.tf`
- **Added**: 9 outputs including:
  - `app_alb_dns_name` - Access application via ALB
  - `app_rds_endpoint` - Database connection string
  - `app_s3_bucket_name` - Artifact storage
  - `app_asg_name` - For scaling policies

## Deployment Workflow

### Phase 1: Infrastructure Setup
```bash
cd iac/preprod

# Review configuration
cat terraform.tfvars | grep -A 20 "# Application Configuration"

# Initialize Terraform
terraform init

# Plan infrastructure
terraform plan -out=tfplan

# Apply infrastructure
terraform apply tfplan
```

### Phase 2: CI/CD Pipeline
```bash
# AWS CodeBuild project will:
# 1. Install npm dependencies
# 2. Run ESLint linting
# 3. Build React/Express app (npm run build)
# 4. Package artifacts to S3
# 5. Generate deployment scripts

# Buildspec phases:
# - Pre-build: npm install + lint
# - Build: npm run build
# - Post-build: Package + S3 upload + script generation
# - Finally: Log deployment status
```

### Phase 3: Application Deployment
```bash
# Deployment script will:
# 1. Extract artifact from S3
# 2. Install application dependencies
# 3. Start Node.js server with PM2
# 4. Configure Express to serve React frontend
# 5. Enable CloudWatch logging

# Health check validates:
# - HTTP 200 response on port 3000
# - React frontend serving on /
# - Express API responding
```

## Configuration Reference

### Required Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `app_instance_type` | EC2 instance size | `t3.micro` |
| `asg_min_size` | Min instances | `1` |
| `asg_desired_capacity` | Target instances | `2` |
| `asg_max_size` | Max instances | `3` |
| `db_engine_version` | MySQL version | `8.0.35` |
| `db_instance_class` | RDS size | `db.t3.micro` |
| `db_username` | Database user | `admin` |
| `db_password` | Database password | `**** (sensitive)` |

### Optional Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `enable_https` | HTTPS support | `false` |
| `certificate_arn` | ACM certificate | `""` |
| `enable_rds` | Create RDS database | `true` |
| `enable_monitoring` | CloudWatch alarms | `true` |

## AWS Resources Created

### Compute
- **ALB** (Application Load Balancer) - HTTP/HTTPS load balancing
- **Target Group** - Health checks every 30s, sticky sessions
- **ASG** (Auto Scaling Group) - 1-3 instances, ELB health check
- **Launch Template** - Includes user-data.sh for Node.js/PM2 setup
- **EC2 Security Group** - Port 80 (from ALB), 3000 (backend), 22 (SSH)

### Database
- **RDS MySQL** - Multi-AZ, 20GB storage, 7-day automated backups
- **RDS Security Group** - Port 3306 from EC2 instances only

### Networking
- **ALB Security Group** - Port 80 (Internet), 443 (optional)

### Storage & Monitoring
- **S3 Bucket** - Artifact versioning, deployment packages
- **CloudWatch Log Group** - Application logs, 7-day retention

### IAM
- **IAM Role** - S3 access, CloudWatch, Systems Manager
- **IAM Policy** - Least privilege principle

## Application Stack

### Frontend (React 18)
- **Build Tool**: Vite (fast bundling)
- **Styling**: Tailwind CSS
- **Output**: dist/ folder deployed via ALB

### Backend (Express)
- **Runtime**: Node.js 18+
- **Process Manager**: PM2 (auto-restart, clustering)
- **API Routes**: Configured in server/index.js
- **Static Files**: Serves React frontend

### Database (MySQL)
- **Version**: 8.0.35
- **Connection**: Via RDS endpoint
- **Driver**: mysql2/promise (recommended)

## Quick Commands

```bash
# View current infrastructure
terraform output

# Get ALB DNS name
terraform output -raw app_alb_dns_name

# Get RDS endpoint
terraform output -raw app_rds_endpoint

# SSH into EC2 instances
aws ec2-instance-connect open-tunnel --target <instance-id>

# View application logs
aws logs tail /aws/ec2/c3-app-logs --follow

# Scale application
aws autoscaling set-desired-capacity --auto-scaling-group-name c3-app-asg --desired-capacity 3

# Health check
curl -v http://<ALB_DNS_NAME>

# Database check
mysql -h <RDS_ENDPOINT> -u admin -p
```

## Troubleshooting

### Application won't start
1. Check EC2 logs: `cat /var/log/user-data.log`
2. Verify PM2: `pm2 status`
3. Check port 3000: `curl localhost:3000`

### ALB health check failing
1. SSH into instance
2. Verify Express running: `pm2 status`
3. Test app: `curl localhost:3000`
4. Check security group: Allow 3000 from ALB SG

### Database connection error
1. Verify RDS is running: `aws rds describe-db-instances`
2. Check password: `grep db_password terraform.tfvars`
3. Verify EC2→RDS security group rule
4. Test connection: `mysql -h <RDS_ENDPOINT> -u admin -p`

### CodeBuild build failing
1. Check buildspec.yml syntax
2. Verify npm dependencies: `npm install` locally
3. Run lint: `npm run lint`
4. Check S3 bucket permissions
5. Review CodeBuild logs in AWS Console

## Next Steps

1. **Deploy Infrastructure**
   ```bash
   cd iac/preprod
   terraform apply
   ```

2. **Configure Application**
   - Get ALB DNS: `terraform output app_alb_dns_name`
   - Update .env with RDS endpoint
   - Configure app-specific settings

3. **Setup CI/CD**
   - Create CodeBuild project
   - Connect to git repository
   - Trigger first build

4. **Enable HTTPS** (optional)
   - Request ACM certificate
   - Update `certificate_arn` in variables
   - Set `enable_https = true`

5. **Monitor & Scale**
   - Setup CloudWatch alarms
   - Configure Auto Scaling policies
   - Monitor logs and metrics

## Security Best Practices

✓ **Implemented**
- Security groups with least privilege
- RDS in private subnet
- EC2 in private subnet with ALB frontend
- IAM role with minimal permissions
- Encryption for S3 versioning
- 7-day log retention

⚠️ **To Configure**
- HTTPS/SSL certificates
- Database encryption
- Secrets management for passwords
- VPC Flow Logs for security monitoring

## Documentation Files

| File | Purpose |
|------|---------|
| `c3-app/README.md` | App infrastructure overview |
| `c3-app/deployment/README.md` | Deployment & CI/CD guide |
| `QUICK_START_APP.md` | Common commands reference |
| `C3_APP_SETUP_SUMMARY.md` | Complete architecture & diagrams |

---

**Status**: ✅ All infrastructure and code integration complete. Ready for deployment.

**Last Updated**: Today
**Version**: 1.0
