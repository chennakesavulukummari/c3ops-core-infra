# VPC
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = merge(
    var.tags,
    {
      Name = "${var.core_infra_name}-vpc"
    }
  )
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = merge(
    var.tags,
    {
      Name = "${var.core_infra_name}-igw"
    }
  )
}

# Elastic IPs for NAT Gateways
resource "aws_eip" "nat" {
  count  = var.enable_nat_gateway ? length(var.availability_zones) : 0
  domain = "vpc"

  depends_on = [aws_internet_gateway.main]

  tags = merge(
    var.tags,
    {
      Name = "${var.core_infra_name}-nat-eip-${count.index + 1}"
    }
  )
}

# NAT Gateways (one per public subnet for HA)
resource "aws_nat_gateway" "main" {
  count         = var.enable_nat_gateway ? length(var.availability_zones) : 0
  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id

  depends_on = [aws_internet_gateway.main]

  tags = merge(
    var.tags,
    {
      Name = "${var.core_infra_name}-nat-${count.index + 1}"
    }
  )
}

# PUBLIC SUBNETS
resource "aws_subnet" "public" {
  count                   = length(var.public_subnet_cidrs)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = merge(
    var.tags,
    {
      Name = "${var.core_infra_name}-public-subnet-${count.index + 1}"
      Tier = "Public"
    }
  )
}

# PRIVATE WEB SUBNETS
resource "aws_subnet" "private_web" {
  count             = length(var.private_web_subnet_cidrs)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_web_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]

  tags = merge(
    var.tags,
    {
      Name = "${var.core_infra_name}-private-web-subnet-${count.index + 1}"
      Tier = "Private-Web"
    }
  )
}

# PRIVATE APP SUBNETS
resource "aws_subnet" "private_app" {
  count             = length(var.private_app_subnet_cidrs)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_app_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]

  tags = merge(
    var.tags,
    {
      Name = "${var.core_infra_name}-private-app-subnet-${count.index + 1}"
      Tier = "Private-App"
    }
  )
}

# PRIVATE DB SUBNETS
resource "aws_subnet" "private_db" {
  count             = length(var.private_db_subnet_cidrs)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_db_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]

  tags = merge(
    var.tags,
    {
      Name = "${var.core_infra_name}-private-db-subnet-${count.index + 1}"
      Tier = "Private-DB"
    }
  )
}

# PUBLIC ROUTE TABLE
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block      = "0.0.0.0/0"
    gateway_id      = aws_internet_gateway.main.id
  }

  tags = merge(
    var.tags,
    {
      Name = "${var.core_infra_name}-public-rt"
    }
  )
}

# Public Route Table Associations
resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# PRIVATE WEB ROUTE TABLES (NAT route)
resource "aws_route_table" "private_web" {
  count  = var.enable_nat_gateway ? length(var.availability_zones) : 0
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main[count.index].id
  }

  tags = merge(
    var.tags,
    {
      Name = "${var.core_infra_name}-private-web-rt-${count.index + 1}"
    }
  )
}

# Private Web Route Table Associations
resource "aws_route_table_association" "private_web" {
  count          = length(aws_subnet.private_web)
  subnet_id      = aws_subnet.private_web[count.index].id
  route_table_id = aws_route_table.private_web[count.index].id
}

# PRIVATE APP ROUTE TABLES (NAT route)
resource "aws_route_table" "private_app" {
  count  = var.enable_nat_gateway ? length(var.availability_zones) : 0
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main[count.index].id
  }

  tags = merge(
    var.tags,
    {
      Name = "${var.core_infra_name}-private-app-rt-${count.index + 1}"
    }
  )
}

# Private App Route Table Associations
resource "aws_route_table_association" "private_app" {
  count          = length(aws_subnet.private_app)
  subnet_id      = aws_subnet.private_app[count.index].id
  route_table_id = aws_route_table.private_app[count.index].id
}

# PRIVATE DB ROUTE TABLES (No external route - DB only within VPC)
resource "aws_route_table" "private_db" {
  count  = length(var.availability_zones)
  vpc_id = aws_vpc.main.id

  tags = merge(
    var.tags,
    {
      Name = "${var.core_infra_name}-private-db-rt-${count.index + 1}"
    }
  )
}

# Private DB Route Table Associations
resource "aws_route_table_association" "private_db" {
  count          = length(aws_subnet.private_db)
  subnet_id      = aws_subnet.private_db[count.index].id
  route_table_id = aws_route_table.private_db[count.index].id
}

# Network ACLs for security layers
# Public NACL
resource "aws_network_acl" "public" {
  vpc_id     = aws_vpc.main.id
  #subnet_ids = [aws_subnet.public[*].id, aws_subnet.private_web[*].id, aws_subnet.private_app[*].id, aws_subnet.private_db[*].id]

subnet_ids = flatten([
  aws_subnet.public[*].id,
  aws_subnet.private_web[*].id,
  aws_subnet.private_app[*].id,
  aws_subnet.private_db[*].id
])

  ingress {
    protocol   = "tcp"
    rule_no    = 100
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 80
    to_port    = 80
  }

  ingress {
    protocol   = "tcp"
    rule_no    = 110
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 443
    to_port    = 443
  }

  ingress {
    protocol   = "tcp"
    rule_no    = 120
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 1024
    to_port    = 65535
  }

  egress {
    protocol   = "-1"
    rule_no    = 100
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 0
    to_port    = 0
  }

  tags = merge(
    var.tags,
    {
      Name = "${var.core_infra_name}-public-nacl"
    }
  )
}

# # Private Web NACL
# resource "aws_network_acl" "private_web" {
#   vpc_id     = aws_vpc.main.id
#   subnet_ids = aws_subnet.private_web[*].id

#   ingress {
#     protocol   = "tcp"
#     rule_no    = 100
#     action     = "allow"
#     cidr_block = var.vpc_cidr
#     from_port  = 0
#     to_port    = 65535
#   }

#   egress {
#     protocol   = "-1"
#     rule_no    = 100
#     action     = "allow"
#     cidr_block = "0.0.0.0/0"
#     from_port  = 0
#     to_port    = 0
#   }

#   tags = merge(
#     var.tags,
#     {
#       Name = "${var.core_infra_name}-private-web-nacl"
#     }
#   )
# }

# # Private App NACL
# resource "aws_network_acl" "private_app" {
#   vpc_id     = aws_vpc.main.id
#   subnet_ids = aws_subnet.private_app[*].id

#   ingress {
#     protocol   = "tcp"
#     rule_no    = 100
#     action     = "allow"
#     cidr_block = var.vpc_cidr
#     from_port  = 0
#     to_port    = 65535
#   }

#   egress {
#     protocol   = "-1"
#     rule_no    = 100
#     action     = "allow"
#     cidr_block = "0.0.0.0/0"
#     from_port  = 0
#     to_port    = 0
#   }

#   tags = merge(
#     var.tags,
#     {
#       Name = "${var.core_infra_name}-private-app-nacl"
#     }
#   )
# }

# # Private DB NACL
# resource "aws_network_acl" "private_db" {
#   vpc_id     = aws_vpc.main.id
#   subnet_ids = aws_subnet.private_db[*].id

#   ingress {
#     protocol   = "tcp"
#     rule_no    = 100
#     action     = "allow"
#     cidr_block = var.vpc_cidr
#     from_port  = 0
#     to_port    = 65535
#   }

#   egress {
#     protocol   = "-1"
#     rule_no    = 100
#     action     = "allow"
#     cidr_block = var.vpc_cidr
#     from_port  = 0
#     to_port    = 0
#   }

#   tags = merge(
#     var.tags,
#     {
#       Name = "${var.core_infra_name}-private-db-nacl"
#     }
#   )
# }

# VPC Flow Logs
resource "aws_cloudwatch_log_group" "main" {
  count             = var.enable_flow_logs ? 1 : 0
  name              = "/aws/vpc/flowlogs/${var.core_infra_name}"
  retention_in_days = 7

  tags = merge(
    var.tags,
    {
      Name = "${var.core_infra_name}-flow-logs"
    }
  )
}

resource "aws_iam_role" "flow_logs" {
  count = var.enable_flow_logs ? 1 : 0
  name  = "${var.core_infra_name}-flow-logs-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "vpc-flow-logs.amazonaws.com"
        }
      }
    ]
  })

  tags = merge(
    var.tags,
    {
      Name = "${var.core_infra_name}-flow-logs-role"
    }
  )
}

resource "aws_iam_role_policy" "flow_logs" {
  count = var.enable_flow_logs ? 1 : 0
  name  = "${var.core_infra_name}-flow-logs-policy"
  role  = aws_iam_role.flow_logs[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogGroups",
          "logs:DescribeLogStreams"
        ]
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })
}

resource "aws_flow_log" "main" {
  count                   = var.enable_flow_logs ? 1 : 0
  iam_role_arn            = aws_iam_role.flow_logs[0].arn
  log_destination         = aws_cloudwatch_log_group.main[0].arn
  traffic_type            = "ALL"
  vpc_id                  = aws_vpc.main.id

  tags = merge(
    var.tags,
    {
      Name = "${var.core_infra_name}-vpc-flow-logs"
    }
  )
}
