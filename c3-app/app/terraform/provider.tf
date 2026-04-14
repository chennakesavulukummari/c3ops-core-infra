terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Uncomment for remote state management after initial setup
  # backend "s3" {
  #   bucket         = "c3ops-terraform-state"
  #   key            = "c3ops.io/terraform.tfstate"
  #   region         = "ap-south-2"
  #   encrypt        = true
  #   dynamodb_table = "terraform-locks"
  # }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = "C3OPS"
      Domain      = "c3ops.io"
      ManagedBy   = "Terraform"
    }
  }
}
