output "security_group_ids" {
  description = "Security group IDs"
  value = {
    public_sg = aws_security_group.public.id
    web_sg    = aws_security_group.web.id
    app_sg    = aws_security_group.app.id
    db_sg     = aws_security_group.db.id
  }
}

output "public_sg_id" {
  description = "Public Security Group ID"
  value       = aws_security_group.public.id
}

output "web_sg_id" {
  description = "Web Tier Security Group ID"
  value       = aws_security_group.web.id
}

output "app_sg_id" {
  description = "App Tier Security Group ID"
  value       = aws_security_group.app.id
}

output "db_sg_id" {
  description = "DB Tier Security Group ID"
  value       = aws_security_group.db.id
}
