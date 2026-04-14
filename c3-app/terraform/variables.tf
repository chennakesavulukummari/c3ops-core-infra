variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-south-2"
}

variable "app_name" {
  description = "Application name"
  type        = string
  default     = "cloudcostconsole"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "preprod"
}

# VPC configuration sourced from core infrastructure state

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "ami_id" {
  description = "AMI ID for EC2 instances"
  type        = string
  default     = "ami-070e5bd3ff10324f8" # Amazon Linux 2023 AMI in ap-south-2 (update as needed)
}

variable "asg_desired_capacity" {
  description = "Desired number of EC2 instances"
  type        = number
  default     = 1
}

variable "asg_min_size" {
  description = "Minimum number of EC2 instances"
  type        = number
  default     = 1
}

variable "asg_max_size" {
  description = "Maximum number of EC2 instances"
  type        = number
  default     = 3
}

variable "enable_database" {
  description = "Enable RDS database"
  type        = bool
  default     = false
}

variable "db_engine" {
  description = "Database engine"
  type        = string
  default     = "mysql"
}

variable "db_instance_class" {
  description = "Database instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "Database storage in GB"
  type        = number
  default     = 20
}

variable "db_username" {
  description = "Database master username"
  type        = string
  sensitive   = true
  default     = "cloudcostconsole"
}

variable "db_password" {
  description = "Database master password"
  type        = string
  sensitive   = true
  default     = "Redhat@123456"
}

variable "enable_https" {
  description = "Enable HTTPS/SSL"
  type        = bool
  default     = false
}

variable "certificate_arn" {
  description = "ACM certificate ARN for HTTPS"
  type        = string
  default     = ""
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default = {
    Project     = "C3OPS"
    Environment = "preprod"
  }
}
