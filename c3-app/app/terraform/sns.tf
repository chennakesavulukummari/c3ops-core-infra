# AWS SNS Configuration for C3OPS.io
# Simple Notification Service for infrastructure alerts and notifications

# SNS Topic for all infrastructure alerts
resource "aws_sns_topic" "alerts" {
  name              = "${var.project_name}-alerts"
  display_name      = "C3OPS Infrastructure Alerts"
  kms_master_key_id = "alias/aws/sns"

  tags = {
    Name = "${var.project_name} Alerts Topic"
  }
}

# SNS Topic Policy - allow CloudWatch to publish
resource "aws_sns_topic_policy" "alerts" {
  arn = aws_sns_topic.alerts.arn

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = [
            "cloudwatch.amazonaws.com",
            "lambda.amazonaws.com",
            "dynamodb.amazonaws.com",
            "ses.amazonaws.com"
          ]
        }
        Action   = "SNS:Publish"
        Resource = aws_sns_topic.alerts.arn
      }
    ]
  })
}

# SNS Topic for DynamoDB notifications
resource "aws_sns_topic" "dynamodb_alerts" {
  name              = "${var.project_name}-dynamodb-alerts"
  display_name      = "DynamoDB Alerts"
  kms_master_key_id = "alias/aws/sns"

  tags = {
    Name = "${var.project_name} DynamoDB Alerts Topic"
  }
}

# SNS Topic Policy for DynamoDB
resource "aws_sns_topic_policy" "dynamodb_alerts" {
  arn = aws_sns_topic.dynamodb_alerts.arn

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = [
            "cloudwatch.amazonaws.com",
            "dynamodb.amazonaws.com"
          ]
        }
        Action   = "SNS:Publish"
        Resource = aws_sns_topic.dynamodb_alerts.arn
      }
    ]
  })
}

# Email subscription to alerts topic (requires manual confirmation)
# Uncomment and update email address to enable
# resource "aws_sns_topic_subscription" "alerts_email" {
#   topic_arn = aws_sns_topic.alerts.arn
#   protocol  = "email"
#   endpoint  = "alerts@c3ops.io"
# }

# CloudWatch Log Group for SNS
resource "aws_cloudwatch_log_group" "sns_logs" {
  name              = "/aws/sns/${var.project_name}"
  retention_in_days = var.log_retention_days

  tags = {
    Name = "${var.project_name} SNS Logs"
  }
}

# SNS Topic for Lambda error notifications
resource "aws_sns_topic" "lambda_errors" {
  name              = "${var.project_name}-lambda-errors"
  display_name      = "Lambda Function Errors"
  kms_master_key_id = "alias/aws/sns"

  tags = {
    Name = "${var.project_name} Lambda Errors Topic"
  }
}

# SNS Topic Policy for Lambda
resource "aws_sns_topic_policy" "lambda_errors" {
  arn = aws_sns_topic.lambda_errors.arn

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = [
            "cloudwatch.amazonaws.com",
            "lambda.amazonaws.com"
          ]
        }
        Action   = "SNS:Publish"
        Resource = aws_sns_topic.lambda_errors.arn
      }
    ]
  })
}

# CloudWatch Alarm for Lambda errors
resource "aws_cloudwatch_metric_alarm" "lambda_error_rate" {
  alarm_name          = "${var.project_name}-lambda-error-rate"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "1"
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = "300"
  statistic           = "Sum"
  threshold           = "5"
  alarm_description   = "Alert if Lambda error rate is high (5+ errors in 5 minutes)"
  alarm_actions       = [aws_sns_topic.lambda_errors.arn]
  treat_missing_data  = "notBreaching"

  dimensions = {
    FunctionName = "${var.project_name}-demo-request"
  }

  tags = {
    Name = "${var.project_name} Lambda Error Rate Alarm"
  }
}

# SNS Topic for API Gateway notifications
resource "aws_sns_topic" "api_alerts" {
  name              = "${var.project_name}-api-alerts"
  display_name      = "API Gateway Alerts"
  kms_master_key_id = "alias/aws/sns"

  tags = {
    Name = "${var.project_name} API Alerts Topic"
  }
}

# SNS Topic Policy for API Gateway
resource "aws_sns_topic_policy" "api_alerts" {
  arn = aws_sns_topic.api_alerts.arn

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = [
            "cloudwatch.amazonaws.com",
            "apigateway.amazonaws.com"
          ]
        }
        Action   = "SNS:Publish"
        Resource = aws_sns_topic.api_alerts.arn
      }
    ]
  })
}

# CloudWatch Alarm for API Gateway 5XX errors
resource "aws_cloudwatch_metric_alarm" "api_5xx_errors" {
  alarm_name          = "${var.project_name}-api-5xx-errors"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "1"
  metric_name         = "5XXError"
  namespace           = "AWS/ApiGateway"
  period              = "300"
  statistic           = "Sum"
  threshold           = "1"
  alarm_description   = "Alert on API Gateway 5XX errors"
  alarm_actions       = [aws_sns_topic.api_alerts.arn]
  treat_missing_data  = "notBreaching"

  tags = {
    Name = "${var.project_name} API 5XX Error Alarm"
  }
}
