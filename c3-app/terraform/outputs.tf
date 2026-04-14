output "alb_dns_name" {
  description = "DNS name of the load balancer"
  value       = aws_lb.app.dns_name
}

output "alb_arn" {
  description = "ARN of the load balancer"
  value       = aws_lb.app.arn
}

output "alb_zone_id" {
  description = "Zone ID of the load balancer"
  value       = aws_lb.app.zone_id
}

output "target_group_arn" {
  description = "ARN of the target group"
  value       = aws_lb_target_group.app.arn
}

output "asg_name" {
  description = "Name of the Auto Scaling Group"
  value       = aws_autoscaling_group.app.name
}

output "asg_arn" {
  description = "ARN of the Auto Scaling Group"
  value       = aws_autoscaling_group.app.arn
}

output "launch_template_id" {
  description = "ID of the launch template"
  value       = aws_launch_template.app.id
}

output "launch_template_latest_version" {
  description = "Latest version of the launch template"
  value       = aws_launch_template.app.latest_version
}

# output "s3_bucket_name" {
#   description = "Name of the S3 artifacts bucket"
#   value       = aws_s3_bucket.app_artifacts.id
# }

# output "s3_bucket_arn" {
#   description = "ARN of the S3 artifacts bucket"
#   value       = aws_s3_bucket.app_artifacts.arn
# }

output "alb_security_group_id" {
  description = "Security group ID for ALB"
  value       = aws_security_group.alb.id
}

output "ec2_security_group_id" {
  description = "Security group ID for EC2 instances"
  value       = aws_security_group.ec2.id
}

output "rds_security_group_id" {
  description = "Security group ID for RDS (if enabled)"
  value       = try(aws_security_group.rds[0].id, "")
}

output "rds_endpoint" {
  description = "RDS database endpoint (if enabled)"
  value       = try(aws_db_instance.app[0].endpoint, "")
}

# CloudFront and Route53 Outputs
output "cloudfront_distribution_id" {
  description = "CloudFront Distribution ID"
  value       = data.aws_cloudfront_distribution.app_ui.id
}

output "cloudfront_domain_name" {
  description = "CloudFront Distribution domain name"
  value       = data.aws_cloudfront_distribution.app_ui.domain_name
}

output "cloudfront_hosted_zone_id" {
  description = "CloudFront Distribution hosted zone ID"
  value       = data.aws_cloudfront_distribution.app_ui.hosted_zone_id
}

output "route53_zone_id" {
  description = "Route53 Hosted Zone ID"
  value       = data.aws_route53_zone.app_domain.zone_id
}

output "route53_zone_name_servers" {
  description = "Route53 Hosted Zone name servers"
  value       = data.aws_route53_zone.app_domain.name_servers
}

output "ui_s3_bucket_name" {
  description = "S3 bucket name for UI deployment"
  value       = aws_s3_bucket.ui_deployment.id
}

output "ui_s3_bucket_arn" {
  description = "S3 bucket ARN for UI deployment"
  value       = aws_s3_bucket.ui_deployment.arn
}

output "app_domain_name" {
  description = "Primary application domain"
  value       = "cloudcostconsole.com"
}

output "app_api_domain" {
  description = "API subdomain for ALB"
  value       = aws_route53_record.app_alb.fqdn
}

output "app_ui_domain" {
  description = "UI subdomain for CloudFront"
  value       = aws_route53_record.app_cdn.fqdn
}

output "rds_resource_id" {
  description = "RDS database resource ID (if enabled)"
  value       = try(aws_db_instance.app[0].resource_id, "")
}

output "cloudwatch_log_group_name" {
  description = "CloudWatch log group name"
  value       = aws_cloudwatch_log_group.app.name
}

output "cloudwatch_log_group_arn" {
  description = "CloudWatch log group ARN"
  value       = aws_cloudwatch_log_group.app.arn
}

output "iam_role_arn" {
  description = "IAM role ARN for EC2 instances"
  value       = aws_iam_role.ec2_role.arn
}

output "app_name" {
  description = "Application name"
  value       = local.app_name
}
