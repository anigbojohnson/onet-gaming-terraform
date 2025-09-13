# Outputs for Security Group IDs

output "web_sg_id" {
  description = "ID of the Web Security Group (public-facing web tier)"
  value       = aws_security_group.web_sg.id
}

output "app_sg_id" {
  description = "ID of the App Security Group (internal app layer)"
  value       = aws_security_group.app_sg.id
}

output "db_sg_id" {
  description = "ID of the Database Security Group (PostgreSQL access)"
  value       = aws_security_group.db_sg.id
}

output "public_alb_sg_id" {
  description = "ID of the Security Group for the Internet-facing ALB"
  value       = aws_security_group.public_alb_sg.id
}

output "internal_alb_sg_id" {
  description = "ID of the Security Group for the Internal ALB"
  value       = aws_security_group.internal_alb_sg.id
}

