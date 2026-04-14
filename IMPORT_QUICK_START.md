# Import Resources - Quick Summary

## What Gets Imported

4 existing AWS resources are brought under Terraform management:

| Resource | ID | Usage |
|----------|-----|-------|
| S3 Bucket | c3cloudcostconsole | Stores UI frontend code |
| CloudFront Distribution | E1P2QRT0GYEL2J | Delivers UI + proxies API |
| Route53 Hosted Zone | Z099400737QOK0UZ3T989 | DNS for cloudcostconsole.com |
| Route53 DNS Records | 3 records | Routes traffic to CloudFront/ALB |

## How They're Used

```
User Visit
    ↓
Route53 (DNS) - Imported
    ↓
CloudFront (CDN) - Imported
    ├─ S3 (UI files) - Imported
    └─ ALB (API) - New
        ↓
    EC2 (App) - New
        ↓
    RDS (Database) - New
```

## Execution Steps

### 1. Configure AWS Credentials
```bash
aws configure
# OR
export AWS_ACCESS_KEY_ID="your-key"
export AWS_SECRET_ACCESS_KEY="your-secret"
export AWS_DEFAULT_REGION="ap-south-2"
```

### 2. Run Import Script
```bash
cd /Users/ck/c3ops-repos/c3ops-core-infra/c3-app/terraform
chmod +x import-resources.sh
./import-resources.sh
```

### 3. Verify Imports
```bash
terraform state list
# Should show imported resources
```

### 4. Deploy App Infrastructure
```bash
export TF_VAR_db_password="password"
terraform apply
```

## Resources in Terraform State

After import, terraform manages:

**Frontend (Imported):**
- S3 bucket with versioning
- CloudFront distribution with cache behaviors
- Route53 zone with DNS records

**Application (New):**
- ALB in public subnets
- EC2 Auto Scaling Group
- Security groups
- IAM roles

**Database (New):**
- RDS MySQL instance
- DB subnet group

**Networking (from Core):**
- VPC, subnets, routes
- NAT gateway

## Complete Workflow

```bash
# Step 1: Credentials
aws configure

# Step 2: Import existing resources
cd c3-app/terraform
chmod +x import-resources.sh
./import-resources.sh

# Step 3: Verify
terraform state list
terraform plan

# Step 4: Deploy new infrastructure
export TF_VAR_db_password="secure-password"
terraform apply

# Step 5: Check outputs
terraform output
```

## Result

All resources (imported + new) managed by single Terraform state file:
- Frontend delivery via S3 + CloudFront
- API backend via ALB + EC2
- Database via RDS
- DNS routing via Route53

See guides for details:
- MANUAL_IMPORT_GUIDE.md - Step-by-step
- c3-app/RESOURCE_IMPORT_GUIDE.md - Architecture
