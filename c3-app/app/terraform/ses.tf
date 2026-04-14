# AWS SES Configuration for C3OPS.io
# Simple Email Service for sending demo request emails and notifications

# SES Configuration Set for tracking and reputation management
resource "aws_ses_configuration_set" "c3ops" {
  name = "${var.project_name}-config-set"
}

# Email address verification for sending emails
# Note: In production, verify the email address in AWS SES console
# or use: aws ses verify-email-identity --email-address <email> --region ap-south-2
resource "aws_ses_email_identity" "sender" {
  email = var.ses_sender_email
}

# CloudWatch Log Group for SES bounce/complaint tracking
resource "aws_cloudwatch_log_group" "ses_logs" {
  name              = "/aws/ses/${var.project_name}"
  retention_in_days = var.log_retention_days

  tags = {
    Name = "${var.project_name} SES Logs"
  }
}

# SES event publishing for bounce events
resource "aws_ses_event_destination" "bounce_destination" {
  name                   = "${var.project_name}-bounce-destination"
  configuration_set_name = aws_ses_configuration_set.c3ops.name
  enabled                = true
  matching_types         = ["bounce"]

  cloudwatch_destination {
    default_value  = "default"
    dimension_name = "ses:configuration-set"
    value_source   = "messageTag"
  }
}

# SES event publishing for complaint events
resource "aws_ses_event_destination" "complaint_destination" {
  name                   = "${var.project_name}-complaint-destination"
  configuration_set_name = aws_ses_configuration_set.c3ops.name
  enabled                = true
  matching_types         = ["complaint"]

  cloudwatch_destination {
    default_value  = "default"
    dimension_name = "ses:configuration-set"
    value_source   = "messageTag"
  }
}

# CloudWatch Alarm for SES send rate limit
resource "aws_cloudwatch_metric_alarm" "ses_send_rate" {
  alarm_name          = "${var.project_name}-ses-send-rate"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "1"
  metric_name         = "Send"
  namespace           = "AWS/SES"
  period              = "60"
  statistic           = "Sum"
  threshold           = "10"
  alarm_description   = "Alert if SES send rate is high (10+ per minute)"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  treat_missing_data  = "notBreaching"

  dimensions = {
    ConfigurationSet = aws_ses_configuration_set.c3ops.name
  }

  tags = {
    Name = "${var.project_name} SES Send Rate Alarm"
  }
}

# CloudWatch Alarm for SES bounce rate
resource "aws_cloudwatch_metric_alarm" "ses_bounce_rate" {
  alarm_name          = "${var.project_name}-ses-bounce-rate"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "1"
  metric_name         = "Bounce"
  namespace           = "AWS/SES"
  period              = "300"
  statistic           = "Sum"
  threshold           = "5"
  alarm_description   = "Alert if SES bounce rate is high (5+ in 5 minutes)"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  treat_missing_data  = "notBreaching"

  dimensions = {
    ConfigurationSet = aws_ses_configuration_set.c3ops.name
  }

  tags = {
    Name = "${var.project_name} SES Bounce Rate Alarm"
  }
}

# CloudWatch Alarm for SES complaint rate
resource "aws_cloudwatch_metric_alarm" "ses_complaint_rate" {
  alarm_name          = "${var.project_name}-ses-complaint-rate"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "1"
  metric_name         = "Complaint"
  namespace           = "AWS/SES"
  period              = "300"
  statistic           = "Sum"
  threshold           = "3"
  alarm_description   = "Alert if SES complaint rate is high (3+ in 5 minutes)"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  treat_missing_data  = "notBreaching"

  tags = {
    Name = "${var.project_name} SES Complaint Rate Alarm"
  }
}
