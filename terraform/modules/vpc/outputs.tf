output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "vpc_cidr" {
  description = "VPC CIDR block"
  value       = aws_vpc.main.cidr_block
}

output "public_subnet_ids" {
  description = "Public subnet IDs"
  value       = aws_subnet.public[*].id
}

output "private_web_subnet_ids" {
  description = "Private web tier subnet IDs"
  value       = aws_subnet.private_web[*].id
}

output "private_app_subnet_ids" {
  description = "Private app tier subnet IDs"
  value       = aws_subnet.private_app[*].id
}

output "private_db_subnet_ids" {
  description = "Private DB tier subnet IDs"
  value       = aws_subnet.private_db[*].id
}

output "internet_gateway_id" {
  description = "Internet Gateway ID"
  value       = aws_internet_gateway.main.id
}

output "nat_gateway_ips" {
  description = "Elastic IPs of NAT Gateways"
  value       = aws_eip.nat[*].public_ip
}

output "public_route_table_id" {
  description = "Public Route Table ID"
  value       = aws_route_table.public.id
}

output "private_web_route_table_ids" {
  description = "Private web tier route table IDs"
  value       = aws_route_table.private_web[*].id
}

output "private_app_route_table_ids" {
  description = "Private app tier route table IDs"
  value       = aws_route_table.private_app[*].id
}

output "private_db_route_table_ids" {
  description = "Private DB tier route table IDs"
  value       = aws_route_table.private_db[*].id
}
