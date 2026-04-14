#!/bin/bash

# C3OPS.io - Terraform Workflow Script
# Quick commands for infrastructure management

set -e

export AWS_PROFILE=c3ops-io
TERRAFORM_DIR="terraform"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

show_help() {
    cat <<EOF
${BLUE}C3OPS.io Infrastructure Management${NC}

Usage: ./scripts/terraform.sh [command]

${GREEN}Setup Commands:${NC}
  init              Initialize Terraform (first time only)
  creds             Configure AWS credentials interactively
  validate          Validate Terraform configuration

${GREEN}Planning Commands:${NC}
  plan              Plan infrastructure changes
  plan-destroy      Plan resource deletion

${GREEN}Deployment Commands:${NC}
  apply             Apply infrastructure changes
  apply-force       Apply without confirmation

${GREEN}Maintenance Commands:${NC}
  output            Show Terraform outputs
  state             Show Terraform state
  refresh           Refresh Terraform state
  fmt               Format Terraform files

${GREEN}Website Commands:${NC}
  build             Build frontend (npm run build)
  deploy-s3         Upload built files to S3
  invalidate-cf     Invalidate CloudFront cache
  deploy-web        Build, upload to S3, invalidate CF

${GREEN}Lambda Commands:${NC}
  package-demo      Package demo request Lambda
  package-typeform  Package typeform handler Lambda

${GREEN}Cleanup Commands:${NC}
  destroy           Destroy all infrastructure (DANGEROUS)
  destroy-force     Destroy without confirmation

${GREEN}Utility Commands:${NC}
  version           Show tool versions
  help              Show this help message

${BLUE}Examples:${NC}
  ./scripts/terraform.sh plan
  ./scripts/terraform.sh apply
  ./scripts/terraform.sh deploy-web
  ./scripts/terraform.sh destroy

EOF
}

# Check prerequisites
check_prerequisites() {
    if ! command -v terraform &> /dev/null; then
        echo -e "${RED}❌ Terraform not found${NC}"
        exit 1
    fi
    if ! command -v aws &> /dev/null; then
        echo -e "${RED}❌ AWS CLI not found${NC}"
        exit 1
    fi
}

# Initialize Terraform
cmd_init() {
    echo -e "${BLUE}🚀 Initializing Terraform...${NC}"
    cd "$TERRAFORM_DIR"
    terraform init
    cd ..
    echo -e "${GREEN}✅ Terraform initialized${NC}"
}

# Configure AWS credentials
cmd_creds() {
    echo -e "${BLUE}🔐 Configuring AWS credentials...${NC}"
    aws configure --profile c3ops-io
    echo ""
    echo -e "${BLUE}🔍 Verifying credentials...${NC}"
    aws sts get-caller-identity --profile c3ops-io
    echo -e "${GREEN}✅ Credentials configured${NC}"
}

# Validate configuration
cmd_validate() {
    echo -e "${BLUE}✓ Validating Terraform configuration...${NC}"
    cd "$TERRAFORM_DIR"
    terraform validate
    echo -e "${BLUE}✓ Formatting Terraform files...${NC}"
    terraform fmt -recursive
    cd ..
    echo -e "${GREEN}✅ Configuration is valid${NC}"
}

# Plan deployment
cmd_plan() {
    echo -e "${BLUE}📋 Planning infrastructure changes...${NC}"
    cd "$TERRAFORM_DIR"
    terraform plan -out=tfplan
    cd ..
    echo -e "${GREEN}✅ Plan saved to terraform/tfplan${NC}"
}

# Plan destruction
cmd_plan_destroy() {
    echo -e "${YELLOW}⚠️  Planning infrastructure destruction...${NC}"
    cd "$TERRAFORM_DIR"
    terraform plan -destroy -out=tfplan-destroy
    cd ..
    echo -e "${YELLOW}⚠️  Destruction plan saved to terraform/tfplan-destroy${NC}"
}

# Apply changes
cmd_apply() {
    echo -e "${BLUE}🚀 Applying infrastructure changes...${NC}"
    cd "$TERRAFORM_DIR"
    terraform apply tfplan
    cd ..
    echo -e "${GREEN}✅ Infrastructure deployed${NC}"
    cmd_output
}

# Apply without confirmation
cmd_apply_force() {
    echo -e "${BLUE}🚀 Applying infrastructure changes (force)...${NC}"
    cd "$TERRAFORM_DIR"
    terraform apply -auto-approve
    cd ..
    echo -e "${GREEN}✅ Infrastructure deployed${NC}"
    cmd_output
}

# Show outputs
cmd_output() {
    echo ""
    echo -e "${BLUE}📊 Infrastructure Outputs:${NC}"
    cd "$TERRAFORM_DIR"
    terraform output
    cd ..
}

# Show state
cmd_state() {
    echo -e "${BLUE}📋 Terraform State:${NC}"
    cd "$TERRAFORM_DIR"
    terraform state list
    cd ..
}

# Refresh state
cmd_refresh() {
    echo -e "${BLUE}🔄 Refreshing Terraform state...${NC}"
    cd "$TERRAFORM_DIR"
    terraform refresh
    cd ..
    echo -e "${GREEN}✅ State refreshed${NC}"
}

# Format files
cmd_fmt() {
    echo -e "${BLUE}✓ Formatting Terraform files...${NC}"
    cd "$TERRAFORM_DIR"
    terraform fmt -recursive
    cd ..
    echo -e "${GREEN}✅ Files formatted${NC}"
}

# Build frontend
cmd_build() {
    echo -e "${BLUE}🏗️  Building frontend...${NC}"
    npm run build
    echo -e "${GREEN}✅ Frontend built${NC}"
}

# Deploy to S3
cmd_deploy_s3() {
    BUCKET=$(cd "$TERRAFORM_DIR" && terraform output -raw s3_bucket_name)
    
    if [ -z "$BUCKET" ]; then
        echo -e "${RED}❌ Could not get S3 bucket name${NC}"
        exit 1
    fi
    
    if [ ! -d "dist" ]; then
        echo -e "${RED}❌ dist/ directory not found. Run: ./scripts/terraform.sh build${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}📤 Uploading to S3 (bucket: $BUCKET)...${NC}"
    
    # Upload assets with long cache
    aws s3 sync dist/ "s3://$BUCKET/" \
        --profile c3ops-io \
        --cache-control "public, max-age=31536000" \
        --exclude "index.html" \
        --exclude ".git/*"
    
    # Upload index.html with short cache (no cache)
    aws s3 cp dist/index.html "s3://$BUCKET/index.html" \
        --profile c3ops-io \
        --cache-control "public, max-age=0, must-revalidate" \
        --content-type "text/html"
    
    echo -e "${GREEN}✅ Uploaded to S3${NC}"
}

# Invalidate CloudFront
cmd_invalidate_cf() {
    DIST_ID=$(cd "$TERRAFORM_DIR" && terraform output -raw cloudfront_distribution_id)
    
    if [ -z "$DIST_ID" ]; then
        echo -e "${RED}❌ Could not get CloudFront distribution ID${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}🔄 Invalidating CloudFront cache (distribution: $DIST_ID)...${NC}"
    
    aws cloudfront create-invalidation \
        --distribution-id "$DIST_ID" \
        --paths "/*" \
        --profile c3ops-io
    
    echo -e "${GREEN}✅ CloudFront cache invalidated${NC}"
}

# Deploy website (build + S3 + CloudFront)
cmd_deploy_web() {
    echo -e "${BLUE}🚀 Starting website deployment...${NC}"
    
    cmd_build
    cmd_deploy_s3
    cmd_invalidate_cf
    
    echo ""
    WEBSITE_URL=$(cd "$TERRAFORM_DIR" && terraform output -raw website_url)
    echo -e "${GREEN}✅ Website deployed successfully!${NC}"
    echo -e "Visit: ${BLUE}${WEBSITE_URL}${NC}"
}

# Package demo request Lambda
cmd_package_demo() {
    echo -e "${BLUE}📦 Packaging demo request Lambda...${NC}"
    
    cd server
    zip -r -q ../demo-request.zip . -x "node_modules/*" "*.env"
    cd ..
    
    echo -e "${GREEN}✅ Created demo-request.zip${NC}"
}

# Package typeform Lambda
cmd_package_typeform() {
    echo -e "${BLUE}📦 Packaging typeform handler Lambda...${NC}"
    
    cd lambda
    zip -r -q ../typeform-handler.zip . -x "node_modules/*" "*.env"
    cd ..
    
    echo -e "${GREEN}✅ Created typeform-handler.zip${NC}"
}

# Destroy infrastructure
cmd_destroy() {
    echo -e "${YELLOW}⚠️  WARNING: This will destroy all infrastructure!${NC}"
    read -p "Type 'destroy c3ops.io' to confirm: " confirmation
    
    if [ "$confirmation" != "destroy c3ops.io" ]; then
        echo -e "${YELLOW}❌ Destruction cancelled${NC}"
        exit 1
    fi
    
    echo -e "${RED}🗑️  Destroying infrastructure...${NC}"
    cd "$TERRAFORM_DIR"
    terraform destroy
    cd ..
    echo -e "${RED}✅ Infrastructure destroyed${NC}"
}

# Destroy without confirmation
cmd_destroy_force() {
    echo -e "${RED}🗑️  Destroying infrastructure (force)...${NC}"
    cd "$TERRAFORM_DIR"
    terraform destroy -auto-approve
    cd ..
    echo -e "${RED}✅ Infrastructure destroyed${NC}"
}

# Show versions
cmd_version() {
    echo -e "${BLUE}Version Information:${NC}"
    echo -n "Terraform: "
    terraform version -json | grep terraform_version | cut -d'"' -f4
    echo -n "AWS CLI: "
    aws --version | cut -d' ' -f1
    echo -n "Node.js: "
    node --version
}

# Main command router
check_prerequisites

case "${1:-help}" in
    init)           cmd_init ;;
    creds)          cmd_creds ;;
    validate)       cmd_validate ;;
    plan)           cmd_plan ;;
    plan-destroy)   cmd_plan_destroy ;;
    apply)          cmd_apply ;;
    apply-force)    cmd_apply_force ;;
    output)         cmd_output ;;
    state)          cmd_state ;;
    refresh)        cmd_refresh ;;
    fmt)            cmd_fmt ;;
    build)          cmd_build ;;
    deploy-s3)      cmd_deploy_s3 ;;
    invalidate-cf)  cmd_invalidate_cf ;;
    deploy-web)     cmd_deploy_web ;;
    package-demo)   cmd_package_demo ;;
    package-typeform) cmd_package_typeform ;;
    destroy)        cmd_destroy ;;
    destroy-force)  cmd_destroy_force ;;
    version)        cmd_version ;;
    help)           show_help ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        show_help
        exit 1
        ;;
esac
