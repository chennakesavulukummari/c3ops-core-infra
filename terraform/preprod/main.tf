module "vpc" {
  source = "../modules/vpc"

  project_name               = var.project_name
  core_infra_name            = var.core_infra_name
  environment                = var.environment
  vpc_cidr                   = var.vpc_cidr
  public_subnet_cidrs        = var.public_subnet_cidrs
  private_web_subnet_cidrs   = var.private_web_subnet_cidrs
  private_app_subnet_cidrs   = var.private_app_subnet_cidrs
  private_db_subnet_cidrs    = var.private_db_subnet_cidrs
  availability_zones         = var.availability_zones
  enable_nat_gateway         = var.enable_nat_gateway
  enable_flow_logs           = var.enable_flow_logs
  aws_region                 = var.aws_region

  tags = merge(
    var.tags,
    {
      Tier = "Core-Infrastructure"
    }
  )
}

module "security" {
  source = "../modules/security"

  project_name = var.project_name
  environment  = var.environment
  vpc_id       = module.vpc.vpc_id

  tags = var.tags

  depends_on = [module.vpc]
}
