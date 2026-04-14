# Quick Start Guide - C3OPS Application Infrastructure

## 1. Prerequisites

```bash
# Check AWS credentials
aws sts get-caller-identity

# Check Terraform
terraform version

# Check Node.js
node --version && npm --version
```

## 2. Get Latest AMI ID

```bash
# Find latest Amazon Linux 2023 AMI
AMI_ID=$(aws ec2 describe-images \
  --owners amazon \
  --filters "Name=name,Values=al2023-ami-*" \
  --query 'sort_by(Images, &CreationDate)[-1].ImageId' \
  --output text)

echo "Latest AMI: $AMI_ID"
```

## 3. Deploy Infrastructure

```bash
cd iac/preprod

# Update terraform.tfvars with AMI ID
cat >> terraform.tfvars << EOF
ami_id = "$AMI_ID"
EOF

# Initialize and deploy
terraform init
terraform plan -out=tfplan
terraform apply tfplan

# Get outputs
terraform output app_summary
```

## 4. Access Application

```bash
# Get ALB DNS name
ALB_DNS=$(terraform output -raw alb_dns_name)
echo "Application URL: http://$ALB_DNS"

# Test application
curl http://$ALB_DNS/
```

## 5. Monitor Application

```bash
# View logs in CloudWatch
aws logs tail /aws/app/c3-app-preprod --follow

# Check ALB target health
aws elbv2 describe-target-health \
  --target-group-arn $(terraform output -raw target_group_arn)

# Get EC2 instances
aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=c3-app-instance" \
  --query 'Reservations[].Instances[].[InstanceId,State.Name,PublicIpAddress]'
```

## 6. Connect to EC2 Instance (Troubleshooting)

```bash
# Get instance IP
INSTANCE_IP=$(aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=c3-app-instance" \
  --query 'Reservations[0].Instances[0].PrivateIpAddress' \
  --output text)

# SSH via bastion or Systems Manager Session Manager
aws ssm start-session --target $(aws ec2 describe-instances \
  --filters "Name=private-ip-address,Values=$INSTANCE_IP" \
  --query 'Reservations[0].Instances[0].InstanceId' \
  --output text)

# Inside the instance
pm2 logs c3-app
tail -f /var/log/user-data.log
```

## 7. Build & Deploy Application

```bash
# Option 1: Using CodeBuild
aws codebuild start-build --project-name c3-app-build

# Option 2: Manual deployment
SSH_KEY="your-key.pem"
INSTANCE_IP="<instance-private-ip>"

# Download latest deployment artifact
aws s3 cp s3://c3-app-preprod-artifacts-*/c3-app-*.tar.gz deploy.tar.gz

# Transfer to instance
scp -i $SSH_KEY deploy.tar.gz ec2-user@$INSTANCE_IP:~/

# On instance
tar -xzf deploy.tar.gz
./deploy/config/deploy.sh
./deploy/config/health-check.sh
```

## 8. View Database

```bash
# Get RDS endpoint
RDS_ENDPOINT=$(terraform output -raw rds_endpoint | cut -d: -f1)

# Connect to database
mysql -h $RDS_ENDPOINT -u admin -p

# Inside MySQL
SHOW DATABASES;
SHOW TABLES;
```

## 9. Scale Application

```bash
# Increase desired capacity
aws autoscaling set-desired-capacity \
  --auto-scaling-group-name $(terraform output -raw asg_name) \
  --desired-capacity 2

# Check scaling progress
aws autoscaling describe-auto-scaling-groups \
  --auto-scaling-group-names $(terraform output -raw asg_name) \
  --query 'AutoScalingGroups[0].[Instances]'
```

## 10. Troubleshooting Commands

```bash
# Check application status
pm2 status
pm2 logs c3-app
pm2 monit

# Check port binding
sudo lsof -i :3000

# Check system resources
free -h
df -h
top

# Check network connectivity
curl http://localhost:3000/
curl -v http://localhost:3000/

# Check security group rules
aws ec2 describe-security-groups --group-ids sg-xxxxxxxx

# Check ALB targets
aws elbv2 describe-target-health \
  --target-group-arn arn:aws:elasticloadbalancing:...
```

## 11. Cleanup (Destroy Resources)

```bash
# Plan destruction
terraform plan -destroy -out=tfplan

# Destroy infrastructure
terraform apply tfplan

# Verify cleanup
aws ec2 describe-instances --filters "Name=tag:Name,Values=c3-app-instance"
```

## 12. Common Errors & Solutions

### Error: "No valid credential sources found"
```bash
# Set AWS credentials
export AWS_ACCESS_KEY_ID="your-key"
export AWS_SECRET_ACCESS_KEY="your-secret"
export AWS_REGION="ap-south-2"
```

### Error: "launch template requires valid image ID"
```bash
# Verify AMI exists in your region
aws ec2 describe-images --image-ids ami-xxxxxxxx
```

### Error: "target group not found"
```bash
# ALB may still be creating. Wait a few moments and retry.
sleep 30
terraform output target_group_arn
```

### Error: "Cannot connect to database"
```bash
# Check security group rule
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxx \
  --protocol tcp \
  --port 3306 \
  --source-group sg-yyyyyyyy  # EC2 security group
```

## Useful Variables

```bash
# Export for easy access
export APP_NAME=$(terraform output -raw app_name)
export ALB_DNS=$(terraform output -raw alb_dns_name)
export ASG_NAME=$(terraform output -raw asg_name)
export S3_BUCKET=$(terraform output -raw s3_bucket_name)
export LOG_GROUP=$(terraform output -raw cloudwatch_log_group_name)

# Use them
echo "App: $APP_NAME, URL: http://$ALB_DNS"
aws logs tail $LOG_GROUP --follow
aws autoscaling describe-auto-scaling-groups --auto-scaling-group-names $ASG_NAME
```

## Documentation Links

- **Main Guide**: [C3OPS App Infrastructure README](c3-app/README.md)
- **Deployment Guide**: [Deployment & CI/CD](c3-app/deployment/README.md)
- **Setup Summary**: [Complete Setup Summary](C3_APP_SETUP_SUMMARY.md)
- **Terraform Guide**: [Terraform Documentation](TERRAFORM_GUIDE.md)

## Support

For detailed information:
1. Check [c3-app/README.md](c3-app/README.md) for architecture
2. Check [c3-app/deployment/README.md](c3-app/deployment/README.md) for deployment
3. Check [C3_APP_SETUP_SUMMARY.md](C3_APP_SETUP_SUMMARY.md) for complete details
4. Review CloudWatch Logs for application errors
5. Check AWS Console for resource status
