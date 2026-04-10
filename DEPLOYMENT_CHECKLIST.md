# C3OPS Core Infrastructure - Deployment Checklist

## Pre-Deployment Checklist

### ✅ Environment Preparation
- [ ] AWS Account access confirmed (Account: 318095823459)
- [ ] AWS region set to ap-south-2
- [ ] Terraform v1.9.5+ installed
- [ ] AWS CLI v2 installed
- [ ] AWS credentials configured
- [ ] Git repository cloned

### ✅ Credential Verification
```bash
# Verify AWS credentials
aws sts get-caller-identity

# Expected output should show Account ID: 318095823459
```

### ✅ Terraform Configuration
- [ ] Terraform version matches: v1.9.5+
- [ ] AWS provider version: 5.0+
- [ ] S3 backend bucket created (optional but recommended)
- [ ] DynamoDB table created for state locking
- [ ] `.gitignore` configured

### ✅ Backend Setup (Recommended)
```bash
# Create S3 bucket for state
aws s3api create-bucket \
  --bucket c3ops-terraform-statefiles \
  --region ap-south-2 \
  --create-bucket-configuration LocationConstraint=ap-south-2

# Create DynamoDB table for state locking
aws dynamodb create-table \
  --table-name terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region ap-south-2
```

## Deployment Checklist

### Step 1: Initialize Terraform
```bash
cd /Users/ck/c3ops-repos/c3ops-core-infra/terraform/preprod
terraform init

# Expected: Backend initialized, modules downloaded
```
- [ ] Terraform initialization successful
- [ ] `.terraform/` directory created
- [ ] `.terraform.lock.hcl` created
- [ ] Backend connected

### Step 2: Validate Configuration
```bash
terraform validate
terraform fmt -check

# Expected: Configuration valid, no formatting issues
```
- [ ] No validation errors
- [ ] Code formatting correct
- [ ] Module syntax valid
- [ ] Variables defined correctly

### Step 3: Review Variables
```bash
terraform variables

# Check all input variables
```
- [ ] AWS region: ap-south-2 ✓
- [ ] Environment: preprod ✓
- [ ] Project name: c3ops ✓
- [ ] Core infra name: c3ops_preprod ✓
- [ ] VPC CIDR: 10.0.0.0/16 ✓
- [ ] Subnets properly configured ✓
- [ ] Availability zones: ap-south-2a, ap-south-2b ✓

### Step 4: Plan Infrastructure
```bash
terraform plan -out=tfplan

# Review the plan carefully
```
- [ ] Plan completed without errors
- [ ] 1 VPC resource
- [ ] 1 Internet Gateway
- [ ] 8 Subnets (2 public, 2 web, 2 app, 2 db)
- [ ] 2 NAT Gateways
- [ ] 2 Elastic IPs
- [ ] 8 Route Tables
- [ ] 4 Network ACLs
- [ ] 4 Security Groups
- [ ] VPC Flow Logs resources
- [ ] Total resources: ~30+

### Step 5: Review Security
- [ ] All security groups properly configured
- [ ] Database tier isolated
- [ ] Public tier accepts external traffic
- [ ] Private tiers have NAT gateway access
- [ ] NACL rules reviewed
- [ ] No overly permissive rules

### Step 6: Apply Configuration
```bash
terraform apply tfplan

# Monitor deployment progress
```
- [ ] VPC created
- [ ] Subnets created
- [ ] Internet Gateway attached
- [ ] NAT Gateways created
- [ ] Route Tables configured
- [ ] NACLs configured
- [ ] Security Groups created
- [ ] VPC Flow Logs enabled
- [ ] All resources tagged correctly

### Step 7: Verify Deployment
```bash
# Get outputs
terraform output -json > outputs.json

# Verify AWS resources
aws ec2 describe-vpcs --region ap-south-2
aws ec2 describe-subnets --region ap-south-2
aws ec2 describe-internet-gateways --region ap-south-2
aws ec2 describe-nat-gateways --region ap-south-2
aws ec2 describe-security-groups --region ap-south-2
```
- [ ] VPC created with ID noted
- [ ] All 8 subnets created
- [ ] IGW attached to VPC
- [ ] 2 NAT Gateways operational
- [ ] All route tables created
- [ ] All security groups created
- [ ] VPC Flow Logs active

## Post-Deployment Tasks

### ✅ Documentation
- [ ] Outputs saved to `outputs.json`
- [ ] VPC ID documented
- [ ] Subnet IDs documented
- [ ] Security Group IDs documented
- [ ] NAT Gateway IPs documented

### ✅ Tagging Verification
```bash
aws ec2 describe-tags \
  --filters "Name=resource-id,Values=<VPC-ID>" \
  --region ap-south-2
```
- [ ] Environment tag: preprod
- [ ] Project tag: c3ops
- [ ] Managed by: Terraform
- [ ] Custom tags applied

### ✅ Monitoring Setup
- [ ] VPC Flow Logs verified in CloudWatch
- [ ] Log group: `/aws/vpc/flowlogs/c3ops_preprod`
- [ ] IAM role created for Flow Logs
- [ ] CloudWatch alarms configured (optional)

### ✅ Security Review
- [ ] Public security group rules reviewed
- [ ] Web tier isolation verified
- [ ] App tier isolation verified
- [ ] Database tier isolation verified
- [ ] No SSH from 0.0.0.0/0 to private tiers (if production)

### ✅ Backup & Disaster Recovery
- [ ] Terraform state backed up
- [ ] Configuration documented
- [ ] Runbook created
- [ ] Recovery procedure tested (optional)

## Testing Checklist

### Network Connectivity Tests
```bash
# Test public subnet to IGW
ping <nat-gateway-ip>

# Test internal connectivity
# (Requires instances in subnets)
```
- [ ] Public subnet has internet access
- [ ] Private subnets can reach NAT Gateway
- [ ] Route tables functioning correctly

### Security Tests
- [ ] Security group rules working as expected
- [ ] NACL rules not blocking legitimate traffic
- [ ] Isolated tier communication verified

### Performance Tests
- [ ] NAT Gateway throughput acceptable
- [ ] No network bottlenecks
- [ ] Flow Logs recording traffic correctly

## Rollback Plan

If issues encountered:

```bash
# Option 1: Destroy and recreate
terraform destroy -auto-approve

# Option 2: Modify and reapply
# Edit terraform.tfvars
terraform plan -out=tfplan
terraform apply tfplan

# Option 3: Inspect state
terraform state show aws_vpc.main
terraform state rm aws_vpc.main  # Remove resource
terraform import aws_vpc.main vpc-xxxxx  # Re-import
```

## Maintenance Checklist

### Daily
- [ ] Monitor VPC Flow Logs
- [ ] Check NAT Gateway status
- [ ] Verify CloudWatch metrics

### Weekly
- [ ] Review security group rules
- [ ] Audit Terraform state file
- [ ] Check for any AWS alerts

### Monthly
- [ ] Review VPC Flow Logs
- [ ] Analyze network traffic patterns
- [ ] Update documentation if needed
- [ ] Review cost estimation

### Quarterly
- [ ] Full infrastructure review
- [ ] Disaster recovery drill
- [ ] Update Terraform provider
- [ ] Security audit

## Troubleshooting Quick Reference

| Issue | Solution | Status |
|-------|----------|--------|
| Terraform init fails | Check AWS credentials, region | |
| Plan shows errors | Validate config: `terraform validate` | |
| State lock error | Check DynamoDB table exists | |
| NAT Gateway not working | Verify Elastic IP attached | |
| VPC Flow Logs missing | Check IAM role permissions | |
| Security group not working | Review security group rules | |

## Support Contacts

- **AWS Support**: https://console.aws.amazon.com/support
- **Terraform Community**: https://discuss.hashicorp.com
- **DevOps Team**: [Internal Contact]
- **AWS Account Manager**: [Contact Info]

## Approval Sign-Off

### Deployment Approval
- [ ] Technical Lead Approved: _______________  Date: _____
- [ ] Security Team Approved: _______________  Date: _____
- [ ] DevOps Lead Approved: _______________  Date: _____

### Deployment Completion
- Deployment Date: _______________
- Deployed By: _______________
- Verified By: _______________
- Notes: _______________

---

## Environment Summary

| Property | Value |
|----------|-------|
| AWS Account | 318095823459 |
| Region | ap-south-2 |
| Environment | preprod |
| Infrastructure Name | c3ops_preprod |
| VPC CIDR | 10.0.0.0/16 |
| Public Subnets | 2 |
| Private Web Subnets | 2 |
| Private App Subnets | 2 |
| Private DB Subnets | 2 |
| NAT Gateways | 2 |
| Security Groups | 4 |
| NACLs | 4 |
| Terraform Version | 1.9.5+ |
| Status | Ready for Deployment |

---

**Created**: April 9, 2024
**Version**: 1.0
**Last Updated**: April 9, 2024
