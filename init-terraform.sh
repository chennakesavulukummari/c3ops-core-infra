#!/bin/bash

# AWS CodeBuild Initialization Script for C3OPS Preprod Infrastructure

set -e

echo "==================================="
echo "C3OPS Core Infrastructure Deployment"
echo "Environment: preprod"
echo "Region: ap-south-2"
echo "Account: 225989338000"
echo "==================================="

# Check Terraform version
echo "Checking Terraform version..."
terraform version

# Initialize Terraform
echo "Initializing Terraform..."
cd terraform/preprod
terraform init

# Validate configuration
echo "Validating Terraform configuration..."
terraform validate

# Format check
echo "Checking Terraform formatting..."
terraform fmt -check

# Plan infrastructure
echo "Planning infrastructure deployment..."
terraform plan -out=tfplan

echo "==================================="
echo "Terraform plan completed successfully!"
echo "Review the plan and run 'terraform apply tfplan' to deploy"
echo "==================================="
