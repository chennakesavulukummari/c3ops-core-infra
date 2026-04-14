variable "aws_region" {
  description = "AWS region for infrastructure"
  type        = string
  default     = "ap-south-2"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "c3ops-website"
}

variable "domain_name" {
  description = "Primary domain name (c3ops.io)"
  type        = string
  default     = "c3ops.io"
}

variable "certificate_arn" {
  description = "ACM certificate ARN for c3ops.io (must be in us-east-1 for CloudFront). Create with: aws acm request-certificate --domain-name c3ops.io --subject-alternative-names '*.c3ops.io' --region us-east-1"
  type        = string
  sensitive   = true
  default     = "arn:aws:acm:us-east-1:318095823459:certificate/96c032f9-8546-4893-b4b4-e0725902e2f0"
}

variable "lambda_memory" {
  description = "Lambda memory allocation in MB"
  type        = number
  default     = 256
}

variable "lambda_timeout" {
  description = "Lambda timeout in seconds"
  type        = number
  default     = 30
}

variable "dynamodb_billing_mode" {
  description = "DynamoDB billing mode (PAY_PER_REQUEST or PROVISIONED)"
  type        = string
  default     = "PAY_PER_REQUEST"
}

variable "enable_cloudwatch_logs" {
  description = "Enable CloudWatch logs for Lambda and API Gateway"
  type        = bool
  default     = true
}

variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 30
}

variable "tags" {
  description = "Additional tags to apply to resources"
  type        = map(string)
  default = {
    Owner      = "C3OPS"
    CostCenter = "Engineering"
    Compliance = "SOC2"
  }
}
variable "ses_sender_email" {
  description = "Email address to use as SES sender for demo requests and notifications"
  type        = string
  default     = "info@c3ops.io"
}