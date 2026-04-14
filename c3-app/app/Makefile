.PHONY: help tf-init tf-plan tf-apply tf-destroy tf-validate web-build web-deploy web-invalidate deploy-all

# Variables
AWS_PROFILE=c3ops-io
TF_DIR=terraform
DOMAIN=c3ops.io

help:
	@echo "C3OPS.io Infrastructure Management"
	@echo ""
	@echo "Setup:"
	@echo "  make tf-init          Initialize Terraform"
	@echo "  make tf-validate      Validate Terraform configuration"
	@echo ""
	@echo "Planning & Deployment:"
	@echo "  make tf-plan          Plan infrastructure changes"
	@echo "  make tf-apply         Apply infrastructure changes"
	@echo ""
	@echo "Website:"
	@echo "  make web-build        Build frontend"
	@echo "  make web-deploy       Deploy to S3"
	@echo "  make web-invalidate   Invalidate CloudFront"
	@echo "  make deploy-all       Build, deploy, and invalidate"
	@echo ""
	@echo "Cleanup:"
	@echo "  make tf-destroy       Destroy all infrastructure"

tf-init:
	@echo "🚀 Initializing Terraform..."
	@cd $(TF_DIR) && terraform init

tf-validate:
	@echo "✓ Validating Terraform..."
	@cd $(TF_DIR) && terraform validate && terraform fmt -recursive

tf-plan:
	@echo "📋 Planning infrastructure changes..."
	@cd $(TF_DIR) && terraform plan -out=tfplan

tf-apply: tf-plan
	@echo "🚀 Applying infrastructure..."
	@cd $(TF_DIR) && terraform apply tfplan
	@cd $(TF_DIR) && terraform output

web-build:
	@echo "🏗️  Building frontend..."
	@npm run build

web-deploy: web-build
	@echo "📤 Deploying to S3..."
	@bash scripts/terraform.sh deploy-s3

web-invalidate:
	@echo "🔄 Invalidating CloudFront..."
	@bash scripts/terraform.sh invalidate-cf

deploy-all: web-build
	@echo "🚀 Full website deployment..."
	@bash scripts/terraform.sh deploy-web

tf-destroy:
	@echo "⚠️  Destroying infrastructure..."
	@cd $(TF_DIR) && terraform destroy

clean:
	@echo "🧹 Cleaning build artifacts..."
	@rm -rf dist/
	@rm -rf node_modules/
	@rm -f terraform/tfplan*
	@rm -f *.zip
