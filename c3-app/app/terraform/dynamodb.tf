# DynamoDB Table for Typeform submissions
resource "aws_dynamodb_table" "typeform_submissions" {
  name         = "${var.project_name}-typeform-dynamodb"
  billing_mode = var.dynamodb_billing_mode
  hash_key     = "id"
  range_key    = "timestamp"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "N"
  }

  # Global Secondary Index for email queries
  global_secondary_index {
    name            = "EmailIndex"
    hash_key        = "email"
    range_key       = "timestamp"
    projection_type = "ALL"
  }

  attribute {
    name = "email"
    type = "S"
  }

  # Point-in-time recovery for data protection
  point_in_time_recovery {
    enabled = true
  }

  # Server-side encryption
  server_side_encryption {
    enabled     = true
    kms_key_arn = null # Uses AWS-managed key
  }

  # Enable TTL for automatic cleanup of old submissions (optional)
  ttl {
    attribute_name = "expiresAt"
    enabled        = false # Enable if you want auto-cleanup
  }

  tags = {
    Name = "${var.project_name} Typeform Submissions"
  }
}

# CloudWatch Alarms for DynamoDB
resource "aws_cloudwatch_metric_alarm" "dynamodb_throttle" {
  alarm_name          = "${var.project_name}-dynamodb-throttle"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "1"
  metric_name         = "ConsumedWriteCapacityUnits"
  namespace           = "AWS/DynamoDB"
  period              = "300"
  statistic           = "Sum"
  threshold           = "100"
  alarm_description   = "Alert if DynamoDB write capacity is throttled"
  alarm_actions       = [aws_sns_topic.dynamodb_alerts.arn]
  treat_missing_data  = "notBreaching"

  dimensions = {
    TableName = aws_dynamodb_table.typeform_submissions.name
  }

  tags = {
    Name = "${var.project_name} DynamoDB Throttle Alarm"
  }
}

output "dynamodb_table_name" {
  description = "DynamoDB table name"
  value       = aws_dynamodb_table.typeform_submissions.name
}

output "dynamodb_table_arn" {
  description = "DynamoDB table ARN"
  value       = aws_dynamodb_table.typeform_submissions.arn
}
