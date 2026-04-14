# API Gateway HTTP API for Lambda integration
resource "aws_apigatewayv2_api" "main" {
  name          = "${var.project_name}-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = [
      "https://${var.domain_name}",
      "http://localhost:5173",
      "http://localhost:3001"
    ]
    allow_methods     = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allow_headers     = ["Content-Type", "Authorization", "X-Amz-Date", "X-Api-Key", "X-Amz-Security-Token"]
    expose_headers    = ["Content-Type", "X-Amzn-RequestId"]
    max_age           = 300
    allow_credentials = true
  }

  tags = {
    Name = "${var.project_name} API"
  }
}

# API Gateway Stage
resource "aws_apigatewayv2_stage" "main" {
  api_id      = aws_apigatewayv2_api.main.id
  name        = var.environment
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gateway.arn
    format = jsonencode({
      requestId      = "$context.requestId"
      ip             = "$context.identity.sourceIp"
      requestTime    = "$context.requestTime"
      httpMethod     = "$context.httpMethod"
      resourcePath   = "$context.resourcePath"
      status         = "$context.status"
      protocol       = "$context.protocol"
      responseLength = "$context.responseLength"
      error          = "$context.error.message"
      errorType      = "$context.error.messageString"
    })
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-stage"
  }
}

# CloudWatch Log Group for API Gateway
resource "aws_cloudwatch_log_group" "api_gateway" {
  name              = "/aws/apigateway/${var.project_name}"
  retention_in_days = var.log_retention_days

  tags = {
    Name = "${var.project_name} API Gateway Logs"
  }
}

# API Gateway Integration with Lambda (for demo request)
resource "aws_apigatewayv2_integration" "demo_request" {
  api_id = aws_apigatewayv2_api.main.id

  integration_type       = "AWS_PROXY"
  integration_method     = "POST"
  payload_format_version = "2.0"
  integration_uri        = aws_lambda_function.demo_request.invoke_arn
}

# API Gateway Route for /api/send-demo-request
resource "aws_apigatewayv2_route" "demo_request" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "POST /api/send-demo-request"
  target    = "integrations/${aws_apigatewayv2_integration.demo_request.id}"
}

# API Gateway Integration with Lambda (for typeform)
resource "aws_apigatewayv2_integration" "typeform" {
  api_id = aws_apigatewayv2_api.main.id

  integration_type       = "AWS_PROXY"
  integration_method     = "POST"
  payload_format_version = "2.0"
  integration_uri        = aws_lambda_function.typeform_submit.invoke_arn
}

# API Gateway Route for /api/typeform/submit
resource "aws_apigatewayv2_route" "typeform_submit" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "POST /api/typeform/submit"
  target    = "integrations/${aws_apigatewayv2_integration.typeform.id}"
}

# API Gateway Route for /api/health
resource "aws_apigatewayv2_route" "health_check" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "GET /api/health"
  target    = "integrations/${aws_apigatewayv2_integration.health.id}"
}

resource "aws_apigatewayv2_integration" "health" {
  api_id = aws_apigatewayv2_api.main.id

  integration_type       = "AWS_PROXY"
  integration_method     = "POST"
  payload_format_version = "2.0"
  integration_uri        = aws_lambda_function.health_check.invoke_arn
}

# Lambda permission for API Gateway
resource "aws_lambda_permission" "api_gateway_demo" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.demo_request.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

resource "aws_lambda_permission" "api_gateway_typeform" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.typeform_submit.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

resource "aws_lambda_permission" "api_gateway_health" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.health_check.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

# Output API Gateway URL
output "api_endpoint" {
  description = "API Gateway endpoint URL"
  value       = aws_apigatewayv2_stage.main.invoke_url
}
