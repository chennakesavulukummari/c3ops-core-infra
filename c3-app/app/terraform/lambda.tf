# IAM role for Lambda execution
resource "aws_iam_role" "lambda_role" {
  name = "${var.project_name}-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# IAM policy for basic Lambda execution
resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# IAM policy for DynamoDB and SES access
resource "aws_iam_role_policy" "lambda_dynamodb_ses" {
  name = "${var.project_name}-lambda-dynamodb-ses"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = [
          aws_dynamodb_table.typeform_submissions.arn,
          "${aws_dynamodb_table.typeform_submissions.arn}/index/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "ses:SendEmail",
          "ses:SendRawEmail",
          "ses:GetSendQuota",
          "ses:GetSendStatistics"
        ]
        Resource = "*"
      }
    ]
  })
}

# CloudWatch Log Group for Lambda
resource "aws_cloudwatch_log_group" "lambda_logs" {
  name              = "/aws/lambda/${var.project_name}"
  retention_in_days = var.log_retention_days

  tags = {
    Name = "${var.project_name} Lambda Logs"
  }
}

# Health Check Lambda
resource "aws_lambda_function" "health_check" {
  filename      = "lambda_placeholder.zip"
  function_name = "${var.project_name}-health-check"
  role          = aws_iam_role.lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  timeout       = 10
  memory_size   = 128

  environment {
    variables = {
      ENVIRONMENT = var.environment
      DOMAIN      = var.domain_name
    }
  }

  tags = {
    Name = "${var.project_name} Health Check"
  }
}

# Demo Request Lambda
resource "aws_lambda_function" "demo_request" {
  filename      = "lambda_placeholder.zip"
  function_name = "${var.project_name}-demo-request"
  role          = aws_iam_role.lambda_role.arn
  handler       = "server/lambda.handler"
  runtime       = "nodejs18.x"
  timeout       = var.lambda_timeout
  memory_size   = var.lambda_memory

  environment {
    variables = {
      ENVIRONMENT        = var.environment
      DYNAMODB_TABLE     = aws_dynamodb_table.typeform_submissions.name
      FROM_EMAIL         = "info@c3ops.io"
      ADMIN_EMAIL        = "info@c3ops.io"
      GMAIL_USER         = "your-email@gmail.com"
      GMAIL_APP_PASSWORD = "your-app-password"
    }
  }

  depends_on = [aws_iam_role_policy_attachment.lambda_basic_execution]

  tags = {
    Name = "${var.project_name} Demo Request"
  }
}

# Typeform Submit Lambda
resource "aws_lambda_function" "typeform_submit" {
  filename            = "lambda_dist.zip"
  source_code_hash    = filebase64sha256("lambda_dist.zip")
  function_name       = "${var.project_name}-typeform-submit"
  role                = aws_iam_role.lambda_role.arn
  handler             = "typeform-handler.submitTypeform"
  runtime             = "nodejs18.x"
  timeout             = var.lambda_timeout
  memory_size         = var.lambda_memory

  environment {
    variables = {
      ENVIRONMENT        = var.environment
      DYNAMODB_TABLE     = aws_dynamodb_table.typeform_submissions.name
      FROM_EMAIL         = "info@c3ops.io"
      ADMIN_EMAIL        = "info@c3ops.io"
      GMAIL_USER         = "your-email@gmail.com"
      GMAIL_APP_PASSWORD = "your-app-password"
    }
  }

  depends_on = [aws_iam_role_policy_attachment.lambda_basic_execution]

  tags = {
    Name = "${var.project_name} Typeform Submit"
  }
}

# Lambda Layer for Node.js dependencies (optional)
# resource "aws_lambda_layer_version" "dependencies" {
#   filename   = "lambda_layer.zip"
#   layer_name = "${var.project_name}-dependencies"
#   source_code_hash = filebase64sha256("lambda_layer.zip")
#   compatible_runtimes = ["nodejs18.x"]
# }

output "lambda_demo_request_arn" {
  description = "Demo Request Lambda ARN"
  value       = aws_lambda_function.demo_request.arn
}

output "lambda_typeform_arn" {
  description = "Typeform Submit Lambda ARN"
  value       = aws_lambda_function.typeform_submit.arn
}
