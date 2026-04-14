terraform {
  required_version = ">= 1.9.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "c3ops-terraform-statefiles"
    key            = "c3app_preprod/c3-app-terraform.tfstate"
    region         = "ap-south-2"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      Application = var.app_name
      CostCenter  = "c3ops"
      Billing     = "finops"
      Owner       = "platform-team"
    }
  }
}

# Reference the core infrastructure state file
data "terraform_remote_state" "core" {
  backend = "s3"
  config = {
    bucket         = "c3ops-terraform-statefiles"
    key            = "c3ops_preprod/terraform.tfstate"
    region         = "ap-south-2"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}

