variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-south-2"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "preprod"
}

variable "project_name" {
  description = "Project name for C3OPS"
  type        = string
  default     = "cloudcostconsole"
}

variable "core_infra_name" {
  description = "Core infrastructure name"
  type        = string
  default     = "c3ops_preprod"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.1.0/28", "10.0.2.0/28"]
}

variable "private_web_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.3.0/24", "10.0.4.0/24"]
}

variable "availability_zones" {
  description = "Availability zones for the region"
  type        = list(string)
  default     = ["ap-south-2a", "ap-south-2b"]
}

variable "enable_nat_gateway" {
  description = "Enable NAT Gateway for private subnets"
  type        = bool
  default     = true
}

variable "enable_flow_logs" {
  description = "Enable VPC Flow Logs"
  type        = bool
  default     = true
}

variable "tags" {
  description = "Additional tags to apply to resources"
  type        = map(string)
  default = {
    Owner      = "C3OPS"
    CostCenter = "Infrastructure"
    Compliance = "Yes"
  }
}
