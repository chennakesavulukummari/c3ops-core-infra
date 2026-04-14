output "cloudfront_domain_name" {
  description = "CloudFront domain name"
  value       = aws_cloudfront_distribution.website.domain_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.website.id
}

output "s3_bucket_name" {
  description = "S3 bucket for website"
  value       = aws_s3_bucket.website.id
}

output "api_gateway_endpoint" {
  description = "API Gateway endpoint"
  value       = aws_apigatewayv2_stage.main.invoke_url
}

output "website_url" {
  description = "Website URL"
  value       = "https://${var.domain_name}"
}

output "api_url" {
  description = "API URL"
  value       = "https://api.${var.domain_name}"
}

output "aws_account_id" {
  description = "AWS Account ID"
  value       = data.aws_caller_identity.current.account_id
}

output "deployment_region" {
  description = "AWS Region"
  value       = var.aws_region
}

output "environment" {
  description = "Environment name"
  value       = var.environment
}

output "ses_sender_email" {
  description = "SES sender email address"
  value       = aws_ses_email_identity.sender.email
}

output "ses_configuration_set" {
  description = "SES configuration set name"
  value       = aws_ses_configuration_set.c3ops.name
}

output "sns_alerts_topic_arn" {
  description = "SNS topic ARN for general alerts"
  value       = aws_sns_topic.alerts.arn
}

output "sns_dynamodb_alerts_topic_arn" {
  description = "SNS topic ARN for DynamoDB alerts"
  value       = aws_sns_topic.dynamodb_alerts.arn
}

output "sns_lambda_errors_topic_arn" {
  description = "SNS topic ARN for Lambda errors"
  value       = aws_sns_topic.lambda_errors.arn
}

output "sns_api_alerts_topic_arn" {
  description = "SNS topic ARN for API Gateway alerts"
  value       = aws_sns_topic.api_alerts.arn
}
