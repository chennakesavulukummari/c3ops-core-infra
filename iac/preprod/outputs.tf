output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "vpc_cidr" {
  description = "VPC CIDR block"
  value       = module.vpc.vpc_cidr
}

output "public_subnet_ids" {
  description = "Public subnet IDs"
  value       = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  description = "Private subnet IDs"
  value       = module.vpc.private_subnet_ids
}

output "nat_gateway_ips" {
  description = "Elastic IPs of NAT Gateways"
  value       = module.vpc.nat_gateway_ips
}

output "internet_gateway_id" {
  description = "Internet Gateway ID"
  value       = module.vpc.internet_gateway_id
}

output "public_route_table_id" {
  description = "Public Route Table ID"
  value       = module.vpc.public_route_table_id
}

output "private_route_table_id" {
  description = "Private route table ID"
  value       = module.vpc.private_route_table_id
}

output "security_group_ids" {
  description = "Security group IDs"
  value       = module.security.security_group_ids
}

output "core_infra_summary" {
  description = "Summary of core infrastructure"
  value = {
    project_name       = var.project_name
    environment        = var.environment
    core_infra_name    = var.core_infra_name
    region             = var.aws_region
    vpc_id             = module.vpc.vpc_id
    availability_zones = var.availability_zones
  }
}
