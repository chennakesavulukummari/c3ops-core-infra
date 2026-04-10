# C3OPS Core Infrastructure

> Core Infrastructure as Code for C3OPS Organization on AWS using Terraform

![Terraform](https://img.shields.io/badge/Terraform-v1.9.5-blue)
![AWS](https://img.shields.io/badge/AWS-Cloud-orange)
![Status](https://img.shields.io/badge/Status-Active-green)

## 📋 Overview

This repository contains the complete Infrastructure as Code (IaC) for the C3OPS core infrastructure deployed on AWS. It implements a production-grade, highly-available 3-tier network architecture in the ap-south-2 (Hyderabad) region.

### Key Specifications

- **AWS Account**: 318095823459
- **Environment**: preprod
- **Region**: ap-south-2 (Hyderabad)
- **Availability Zones**: 2 (ap-south-2a, ap-south-2b)
- **Technology**: Terraform v1.9.5
- **CI/CD**: AWS CodeBuild

## 🏗️ Infrastructure Architecture

### Network Design (3-Tier VPC)

```
┌─────────────────────────────────────────────────────────────┐
│                     VPC (10.0.0.0/16)                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────  IGW  ──────────────────────┐      │
│  │                                                   │      │
│  ▼                                                   ▼      │
│ [Public Subnets]                          [NAT Gateway]     │
│ • 10.0.1.0/28 (AZ-a)     ◄─────────────────────►          │
│ • 10.0.2.0/28 (AZ-b)                        │               │
│ (ALB, Bastion)                              │               │
│                                              │               │
│  ┌──────────────────────────────────────────┘               │
│  │                                                          │
│  ▼                                                          │
│ [Private Web Subnets]                                      │
│ • 10.0.3.0/24 (AZ-a)                                      │
│ • 10.0.4.0/24 (AZ-b)                                      │
│ (Web Servers)                                              │
│                                                            │
│  │                                                         │
│  ▼                                                         │
│ [Private App Subnets]                                      │
│ • 10.0.5.0/24 (AZ-a)                                      │
│ • 10.0.6.0/24 (AZ-b)                                      │
│ (Application Servers)                                      │
│                                                            │
│  │                                                         │
│  ▼                                                         │
│ [Private DB Subnets]                                       │
│ • 10.0.7.0/24 (AZ-a)                                      │
│ • 10.0.8.0/24 (AZ-b)                                      │
│ (Databases)                                                │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## 📦 Components Included

### Core AWS Resources

1. **VPC** - Virtual Private Cloud with CIDR 10.0.0.0/16
2. **8 Subnets** - Organized in 4 tiers across 2 AZs
3. **Internet Gateway** - Public internet connectivity
4. **2 NAT Gateways** - Outbound internet for private subnets
5. **Route Tables** - Tier-specific routing
6. **Network ACLs** - Additional security layers
7. **4 Security Groups** - Role-based access control
8. **VPC Flow Logs** - Traffic monitoring

## 📂 Project Structure

```
c3ops-core-infra/
├── README.md                      # This file
├── TERRAFORM_GUIDE.md             # Detailed documentation
├── buildspec.yml                  # AWS CodeBuild config
├── init-terraform.sh              # Init script
│
└── terraform/
    ├── preprod/
    │   ├── provider.tf            # AWS provider
    │   ├── variables.tf           # Input variables
    │   ├── main.tf                # Module calls
    │   ├── outputs.tf             # Outputs
    │   └── terraform.tfvars       # Environment values
    │
    └── modules/
        ├── vpc/                   # VPC module
        │   ├── main.tf
        │   ├── variables.tf
        │   └── outputs.tf
        │
        └── security/              # Security module
            ├── main.tf
            ├── variables.tf
            └── outputs.tf
```

## 🚀 Quick Start

### Prerequisites

1. **Terraform v1.9.5+**
2. **AWS CLI v2**
3. **AWS Credentials** configured

### Deployment

```bash
# Initialize
cd terraform/preprod
terraform init

# Validate
terraform validate

# Plan
terraform plan -out=tfplan

# Apply
terraform apply tfplan

# View outputs
terraform output -json
```

## 📊 Infrastructure Details

### Subnets

| Tier | Subnet 1 | Subnet 2 | Purpose |
|------|----------|----------|---------|
| Public | 10.0.1.0/28 | 10.0.2.0/28 | ALB, Bastion |
| Web | 10.0.3.0/24 | 10.0.4.0/24 | Web Servers |
| App | 10.0.5.0/24 | 10.0.6.0/24 | Applications |
| DB | 10.0.7.0/24 | 10.0.8.0/24 | Databases |

### Security Groups

| Name | Inbound Rules | Purpose |
|------|---------------|---------|
| Public | HTTP, HTTPS, SSH (0.0.0.0/0) | ALB/Bastion |
| Web | HTTP/HTTPS from Public, SSH from Bastion | Web Servers |
| App | Ports from Web, SSH from Bastion | Applications |
| DB | MySQL, PostgreSQL, MongoDB from App | Databases |

## 💰 Estimated Costs

- NAT Gateways: ~$32/month
- Data Transfer: Variable
- **Total**: $32-100/month

## 🔐 Security Features

- Multi-tier network isolation
- Role-based security groups
- Network ACLs for granular control
- VPC Flow Logs for monitoring
- Encrypted state storage
- IAM-based access control

## 🛠️ Common Commands

```bash
# Initialize
terraform init

# Validate configuration
terraform validate

# Format check
terraform fmt -check

# Plan changes
terraform plan -out=tfplan

# Apply changes
terraform apply tfplan

# Destroy infrastructure
terraform destroy

# View state
terraform state list
terraform show
```

## 📞 Support & Documentation

- [Terraform Guide](./TERRAFORM_GUIDE.md)
- [AWS VPC Documentation](https://docs.aws.amazon.com/vpc/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)

## 📝 Version Info

- **Terraform**: 1.9.5+
- **AWS Provider**: 5.0+
- **Status**: Active ✅

---

**Last Updated**: April 9, 2024
