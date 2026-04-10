# C3OPS Core Infrastructure - Quick Reference

## 🚀 Quick Start Commands

```bash
# Navigate to Terraform directory
cd /Users/ck/c3ops-repos/c3ops-core-infra/terraform/preprod

# Initialize Terraform
terraform init

# Validate configuration
terraform validate

# Plan infrastructure
terraform plan -out=tfplan

# Apply configuration
terraform apply tfplan

# View all outputs
terraform output -json

# Destroy infrastructure (if needed)
terraform destroy
```

## 📋 Key Information

| Item | Value |
|------|-------|
| **AWS Account** | 318095823459 |
| **Region** | ap-south-2 (Hyderabad) |
| **Environment** | preprod |
| **Infrastructure Name** | c3ops_preprod |
| **Terraform Version** | 1.9.5+ |
| **VPC CIDR** | 10.0.0.0/16 |
| **Subnets** | 8 (2 public, 2 web, 2 app, 2 db) |
| **Availability Zones** | ap-south-2a, ap-south-2b |
| **NAT Gateways** | 2 (High Availability) |
| **Security Groups** | 4 (tiered) |
| **Network ACLs** | 4 (tiered) |

## 🏗️ Architecture Tiers

### Public Tier
- **Subnets**: 10.0.1.0/28, 10.0.2.0/28
- **Route**: Direct to IGW
- **Purpose**: ALB, Bastion Hosts
- **Security Group**: Public SG

### Web Tier (Private)
- **Subnets**: 10.0.3.0/24, 10.0.4.0/24
- **Route**: Through NAT Gateway
- **Purpose**: Web Servers
- **Security Group**: Web SG

### App Tier (Private)
- **Subnets**: 10.0.5.0/24, 10.0.6.0/24
- **Route**: Through NAT Gateway
- **Purpose**: Application Servers
- **Security Group**: App SG

### DB Tier (Private)
- **Subnets**: 10.0.7.0/24, 10.0.8.0/24
- **Route**: VPC internal only
- **Purpose**: Databases
- **Security Group**: DB SG

## 🔐 Security Group Rules

### Public SG
```
Inbound:
  - TCP 80 (HTTP) from 0.0.0.0/0
  - TCP 443 (HTTPS) from 0.0.0.0/0
  - TCP 22 (SSH) from 0.0.0.0/0
Outbound:
  - All traffic
```

### Web SG
```
Inbound:
  - TCP 80/443 from Public SG
  - TCP 22 from Public SG
Outbound:
  - All traffic
```

### App SG
```
Inbound:
  - TCP 80/443/8080 from Web SG
  - TCP 22 from Public SG
Outbound:
  - All traffic
```

### DB SG
```
Inbound:
  - TCP 3306 (MySQL) from App SG
  - TCP 5432 (PostgreSQL) from App SG
  - TCP 27017 (MongoDB) from App SG
Outbound:
  - All traffic
```

## 📁 File Structure

```
c3ops-core-infra/
├── README.md                    # Start here
├── TERRAFORM_GUIDE.md           # Detailed guide
├── ARCHITECTURE.md              # Architecture diagrams
├── DEPLOYMENT_CHECKLIST.md      # Deployment verification
├── INFRASTRUCTURE_SUMMARY.md    # Project summary
├── buildspec.yml                # AWS CodeBuild config
├── init-terraform.sh            # Init script
│
└── terraform/
    ├── preprod/
    │   ├── provider.tf          # AWS provider
    │   ├── variables.tf         # Input variables
    │   ├── main.tf              # Module calls
    │   ├── outputs.tf           # Outputs
    │   └── terraform.tfvars     # Environment vars
    │
    └── modules/
        ├── vpc/
        │   ├── main.tf
        │   ├── variables.tf
        │   └── outputs.tf
        └── security/
            ├── main.tf
            ├── variables.tf
            └── outputs.tf
```

## 🔍 Key Terraform Commands

```bash
# Initialization
terraform init                  # Initialize backend

# Validation
terraform validate              # Syntax check
terraform fmt -check            # Format check
terraform plan                  # Dry-run

# Deployment
terraform apply tfplan          # Apply changes
terraform apply -auto-approve   # Auto-approve

# Inspection
terraform state list            # List resources
terraform show                  # Display state
terraform output                # Show outputs
terraform output -json          # JSON outputs

# Cleanup
terraform plan -destroy         # Plan destruction
terraform destroy               # Destroy resources
terraform destroy -auto-approve # Auto-destroy

# Troubleshooting
terraform refresh               # Refresh state
terraform state show <resource> # Show specific resource
terraform console               # Interactive console
```

## 📊 Network Layout

```
INTERNET
   |
   v
[IGW] <----- [Public SG]
   |              |
   |              v
   |         [Public Subnets]
   |         10.0.1.0/28
   |         10.0.2.0/28
   |              |
   |              v
   |         [NAT Gateway]
   |              |
   v              v
[Private Web Subnets]
10.0.3.0/24
10.0.4.0/24
   |
   v
[Private App Subnets]
10.0.5.0/24
10.0.6.0/24
   |
   v
[Private DB Subnets]
10.0.7.0/24
10.0.8.0/24
```

## 💰 Cost Summary

```
Monthly Estimated Costs:

NAT Gateways (2)        = $32.00
Data Transfer           = Variable ($0.02/GB)
Route 53 (if used)      = $0.50
CloudWatch (Flow Logs)  = ~$5-10

Total Estimated         = $37-42/month
```

## ✅ Deployment Checklist

Quick checklist before deployment:

- [ ] AWS Account access (318095823459)
- [ ] Region set to ap-south-2
- [ ] Terraform v1.9.5+ installed
- [ ] AWS CLI v2 installed
- [ ] AWS credentials configured
- [ ] Reviewed terraform.tfvars
- [ ] Security group rules verified
- [ ] Subnet CIDRs reviewed
- [ ] S3 backend bucket created (optional)
- [ ] DynamoDB state lock table created (optional)

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| `terraform init` fails | Check AWS credentials and region |
| Plan shows errors | Run `terraform validate` |
| State lock error | Check DynamoDB table exists |
| Permission denied | Verify IAM permissions |
| NAT Gateway issues | Check Elastic IP attached |
| Flow Logs not working | Verify IAM role permissions |

## 📞 Documentation Links

| Document | Purpose |
|----------|---------|
| [README.md](./README.md) | Project overview |
| [TERRAFORM_GUIDE.md](./TERRAFORM_GUIDE.md) | Complete Terraform documentation |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Architecture details & diagrams |
| [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) | Step-by-step deployment |
| [INFRASTRUCTURE_SUMMARY.md](./INFRASTRUCTURE_SUMMARY.md) | Project summary |

## 🔗 External Resources

- [Terraform Docs](https://www.terraform.io/docs)
- [AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest)
- [AWS VPC](https://docs.aws.amazon.com/vpc/)
- [AWS EC2](https://docs.aws.amazon.com/ec2/)

## 🎯 Next Steps

1. **Review** all documentation
2. **Test** in non-prod first
3. **Validate** AWS credentials
4. **Run** `terraform init`
5. **Run** `terraform plan`
6. **Review** plan output
7. **Run** `terraform apply`
8. **Verify** infrastructure in AWS
9. **Document** outputs
10. **Monitor** resources

## 📝 Project Info

- **Version**: 1.0
- **Created**: April 9, 2024
- **Status**: ✅ Ready for Deployment
- **Terraform Version**: 1.9.5+
- **AWS Provider**: 5.0+

---

**For detailed information, refer to [README.md](./README.md)**

**Ready for deployment to AWS Account 318095823459, Region ap-south-2**
