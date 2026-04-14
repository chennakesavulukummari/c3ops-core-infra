# Existing AWS Resources - CloudFront, Route53, S3
# These resources were created manually and managed externally
# Note: data.aws_caller_identity and data.aws_region are defined in main.tf

# Data source for existing CloudFront distribution
data "aws_cloudfront_distribution" "app_ui" {
  id = "E1P2QRT0GYEL2J"
}

# Data source for existing Route53 hosted zone
data "aws_route53_zone" "app_domain" {
  zone_id = "Z099400737QOK0UZ3T989"
}

# S3 Bucket for UI code deployment
resource "aws_s3_bucket" "ui_deployment" {
  bucket = "c3cloudcostconsole"

  tags = merge(
    local.common_tags,
    {
      Name = "C3OPS UI Deployment Bucket"
    }
  )
}

# S3 Bucket versioning
resource "aws_s3_bucket_versioning" "ui_deployment" {
  bucket = aws_s3_bucket.ui_deployment.id

  versioning_configuration {
    status = "Enabled"
  }
}

# S3 Bucket public access block
resource "aws_s3_bucket_public_access_block" "ui_deployment" {
  bucket = aws_s3_bucket.ui_deployment.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# Note: S3 Bucket policy for CloudFront access is managed externally
# No modifications will be made to CloudFront

# Note: S3 Bucket for Application Artifacts removed - to be added in future phase

# Route53 Hosted Zone - now using data source (no longer creating)
# The actual zone was created manually and will be referenced

# Route53 Record for ALB (application backend)
resource "aws_route53_record" "app_alb" {
  zone_id = data.aws_route53_zone.app_domain.zone_id
  name    = "api.cloudcostconsole.com"
  type    = "A"

  alias {
    name                   = aws_lb.app.dns_name
    zone_id                = aws_lb.app.zone_id
    evaluate_target_health = true
  }
}

# Route53 Record for CloudFront (UI/static content)
resource "aws_route53_record" "app_cdn" {
  zone_id = data.aws_route53_zone.app_domain.zone_id
  name    = "cloudcostconsole.com"
  type    = "A"

  alias {
    name                   = data.aws_cloudfront_distribution.app_ui.domain_name
    zone_id                = data.aws_cloudfront_distribution.app_ui.hosted_zone_id
    evaluate_target_health = false
  }
}

# Route53 Record for WWW subdomain
resource "aws_route53_record" "app_www" {
  zone_id = data.aws_route53_zone.app_domain.zone_id
  name    = "www.cloudcostconsole.com"
  type    = "A"

  alias {
    name                   = data.aws_cloudfront_distribution.app_ui.domain_name
    zone_id                = data.aws_cloudfront_distribution.app_ui.hosted_zone_id
    evaluate_target_health = false
  }
}

# Note: CloudFront distribution is managed externally and not modified by Terraform
# Note: CloudFront Origin Access Identity managed externally
