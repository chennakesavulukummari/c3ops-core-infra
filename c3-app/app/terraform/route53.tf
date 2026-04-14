# Note: This creates Route53 hosted zone for the domain
# After deployment, update nameservers at domain registrar with the NS records from this hosted zone

# Create hosted zone
resource "aws_route53_zone" "main" {
  name = var.domain_name
}

# Note: Using created hosted zone (not data source)
# No data source needed since we're creating it

# Route53 alias for c3ops.io → CloudFront
resource "aws_route53_record" "website_main" {
  zone_id = aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.website.domain_name
    zone_id                = aws_cloudfront_distribution.website.hosted_zone_id
    evaluate_target_health = false
  }
}

# www subdomain for c3ops.io
resource "aws_route53_record" "website_www" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "www.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.website.domain_name
    zone_id                = aws_cloudfront_distribution.website.hosted_zone_id
    evaluate_target_health = false
  }
}

# API subdomain for API Gateway
resource "aws_route53_record" "api" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "api.${var.domain_name}"
  type    = "CNAME"
  ttl     = 300
  records = [aws_apigatewayv2_api.main.api_endpoint]
}



# Health check for API endpoint
resource "aws_route53_health_check" "api_health" {
  type              = "HTTPS"
  resource_path     = "/api/health"
  fqdn              = "api.${var.domain_name}"
  port              = 443
  request_interval  = 30
  failure_threshold = 3

  tags = {
    Name = "${var.project_name} API Health Check"
  }
}

output "route53_zone_id" {
  description = "Route53 hosted zone ID"
  value       = aws_route53_zone.main.zone_id
}

output "route53_nameservers" {
  description = "Route53 nameservers"
  value       = aws_route53_zone.main.name_servers
}
