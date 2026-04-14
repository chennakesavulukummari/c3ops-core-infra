# Data source for AWS account ID
data "aws_caller_identity" "current" {}

# Data source for AWS region
data "aws_region" "current" {}

locals {
  app_name = "${var.app_name}-${var.environment}"

  # Reference VPC and subnets from core infrastructure state
  vpc_id             = data.terraform_remote_state.core.outputs.vpc_id
  public_subnet_ids  = data.terraform_remote_state.core.outputs.public_subnet_ids
  private_subnet_ids = data.terraform_remote_state.core.outputs.private_subnet_ids

  common_tags = merge(
    var.tags,
    {
      Name        = local.app_name
      Environment = var.environment
      Application = var.app_name
      ManagedBy   = "terraform"
    }
  )
}

# Note: S3 Bucket for Application Artifacts has been moved to existing-resources.tf
# It's defined there since it already exists in AWS (us-east-1)

# ALB Security Group
resource "aws_security_group" "alb" {
  name        = "${local.app_name}-alb-sg"
  description = "Security group for ALB"
  vpc_id      = local.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow HTTP from anywhere"
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow HTTPS from anywhere"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = local.common_tags
}

# EC2 Security Group
resource "aws_security_group" "ec2" {
  name        = "${local.app_name}-ec2-sg"
  description = "Security group for EC2 instances"
  vpc_id      = local.vpc_id

  ingress {
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
    description     = "Allow HTTP from ALB"
  }

  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
    description     = "Allow Node.js app port from ALB"
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow SSH"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = local.common_tags
}

# Database Security Group (if database is enabled)
resource "aws_security_group" "rds" {
  count       = var.enable_database ? 1 : 0
  name        = "${local.app_name}-rds-sg"
  description = "Security group for RDS database"
  vpc_id      = local.vpc_id

  ingress {
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2.id]
    description     = "Allow MySQL from EC2"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = local.common_tags
}

# IAM Role for EC2 Instances
resource "aws_iam_role" "ec2_role" {
  name_prefix = "${local.app_name}-"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = local.common_tags
}

# Attach SSM policy for Systems Manager access
resource "aws_iam_role_policy_attachment" "ssm_access" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

# Note: S3 access policy removed - S3 bucket to be added in future phase

resource "aws_iam_instance_profile" "ec2_profile" {
  role = aws_iam_role.ec2_role.name
}

# Launch Template for ASG
resource "aws_launch_template" "app" {
  name_prefix   = "${local.app_name}-"
  image_id      = var.ami_id
  instance_type = var.instance_type

  iam_instance_profile {
    arn = aws_iam_instance_profile.ec2_profile.arn
  }

  vpc_security_group_ids = [aws_security_group.ec2.id]

  user_data = base64encode(templatefile("${path.module}/user-data.sh", {
    app_name    = local.app_name
    environment = var.environment
    region      = data.aws_region.current.name
  }))

  tag_specifications {
    resource_type = "instance"
    tags          = merge(local.common_tags, { Name = "${local.app_name}-instance" })
  }

  tag_specifications {
    resource_type = "volume"
    tags          = local.common_tags
  }

  lifecycle {
    create_before_destroy = true
  }
}

# ALB
resource "aws_lb" "app" {
  name_prefix        = substr(replace(local.app_name, "-", ""), 0, 6)
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = local.public_subnet_ids

  enable_deletion_protection = false

  tags = local.common_tags
}

# ALB Target Group
resource "aws_lb_target_group" "app" {
  name_prefix = "app-"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = local.vpc_id

  health_check {
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    path                = "/"
    matcher             = "200-399"
  }

  stickiness {
    type            = "lb_cookie"
    enabled         = true
    cookie_duration = 86400
  }

  tags = local.common_tags

  lifecycle {
    create_before_destroy = true
  }
}

# ALB Listener (HTTP)
resource "aws_lb_listener" "app_http" {
  load_balancer_arn = aws_lb.app.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}

# ALB Listener (HTTPS) - Optional
resource "aws_lb_listener" "app_https" {
  count             = var.enable_https ? 1 : 0
  load_balancer_arn = aws_lb.app.arn
  port              = 443
  protocol          = "HTTPS"
  certificate_arn   = var.certificate_arn
  ssl_policy        = "ELBSecurityPolicy-TLS-1-2-2017-01"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}

# Auto Scaling Group
resource "aws_autoscaling_group" "app" {
  name                      = "${local.app_name}-asg"
  vpc_zone_identifier       = local.private_subnet_ids
  target_group_arns         = [aws_lb_target_group.app.arn]
  health_check_type         = "ELB"
  health_check_grace_period = 300

  min_size         = var.asg_min_size
  max_size         = var.asg_max_size
  desired_capacity = var.asg_desired_capacity

  launch_template {
    id      = aws_launch_template.app.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "${local.app_name}-instance"
    propagate_at_launch = true
  }

  dynamic "tag" {
    for_each = local.common_tags
    content {
      key                 = tag.key
      value               = tag.value
      propagate_at_launch = true
    }
  }

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [aws_lb_listener.app_http]
}

# RDS Subnet Group (if database is enabled)
resource "aws_db_subnet_group" "app" {
  count       = var.enable_database ? 1 : 0
  name_prefix = "${local.app_name}-"
  subnet_ids  = local.private_subnet_ids

  tags = local.common_tags
}

# RDS Database (if enabled)
resource "aws_db_instance" "app" {
  count                   = var.enable_database ? 1 : 0
  identifier              = "${local.app_name}-db"
  engine                  = var.db_engine
  engine_version          = "8.0.32"
  instance_class          = var.db_instance_class
  allocated_storage       = var.db_allocated_storage
  storage_type            = "gp3"
  storage_encrypted       = true
  username                = var.db_username
  password                = var.db_password
  db_subnet_group_name    = aws_db_subnet_group.app[0].name
  vpc_security_group_ids  = [aws_security_group.rds[0].id]
  skip_final_snapshot     = true
  backup_retention_period = 7
  backup_window           = "03:00-04:00"
  maintenance_window      = "sun:04:00-sun:05:00"
  multi_az                = false
  publicly_accessible     = false
  copy_tags_to_snapshot   = true

  tags = local.common_tags

  depends_on = [aws_security_group.rds]
}

# CloudWatch Log Group for Application
resource "aws_cloudwatch_log_group" "app" {
  name_prefix       = "/aws/app/${local.app_name}"
  retention_in_days = 7

  tags = local.common_tags
}
