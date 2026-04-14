#!/bin/bash

# C3OPS.io Terraform Deployment Guide
# This script sets up AWS credentials and initializes Terraform

set -e

echo "================================"
echo "C3OPS.io Terraform Setup"
echo "================================"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first:"
    echo "   https://aws.amazon.com/cli/"
    exit 1
fi

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
    echo "❌ Terraform is not installed. Please install it first:"
    echo "   https://www.terraform.io/downloads"
    exit 1
fi

# Step 1: Create AWS Profile for c3ops.io
echo ""
echo "📝 Setting up AWS profile for c3ops.io..."

aws configure --profile c3ops-io << EOF
[YOUR_AWS_ACCESS_KEY_ID]
[YOUR_AWS_SECRET_ACCESS_KEY]
ap-south-2
json
EOF

echo "✅ AWS profile 'c3ops-io' created"

# Step 2: Verify AWS credentials
echo ""
echo "🔍 Verifying AWS credentials..."
AWS_PROFILE=c3ops-io aws sts get-caller-identity

# Step 3: Create terraform.tfvars from example
echo ""
echo "📋 Creating terraform.tfvars from template..."

if [ ! -f "terraform/terraform.tfvars" ]; then
    cp terraform/terraform.tfvars.example terraform/terraform.tfvars
    echo "✅ Created terraform/terraform.tfvars"
    echo "⚠️  Please update the certificate_arn in terraform/terraform.tfvars"
else
    echo "✅ terraform/terraform.tfvars already exists"
fi

# Step 4: Initialize Terraform
echo ""
echo "🚀 Initializing Terraform..."

cd terraform

export AWS_PROFILE=c3ops-io
terraform init

echo ""
echo "✅ Terraform initialized successfully!"
echo ""
echo "📌 Next Steps:"
echo "   1. Update terraform/terraform.tfvars with your ACM certificate ARN"
echo "   2. Run: cd terraform && terraform plan"
echo "   3. Review the plan output"
echo "   4. Run: terraform apply"
echo ""
echo "🔐 Security Notes:"
echo "   - Your AWS credentials are stored in ~/.aws/credentials"
echo "   - terraform.tfvars is in .gitignore (won't be committed)"
echo "   - Use AWS_PROFILE=c3ops-io for all terraform commands"
echo ""
