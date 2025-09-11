output "db_endpoint" {
  value = module.rds.db_endpoint
}

output "db_username" {
  value = module.rds.db_username
}

output "db_password" {
  value     = module.rds.db_password
  sensitive = true
}

output "db_name" {
  value = module.rds.db_name
}

output "alb_internet_facing_dns" {
  value = module.alb.alb_internet_facing_dns
}

output "alb_internal_dns" {
  value = module.alb.alb_internal_dns
}

output "web_public_ips" {
  description = "Public IPs of web servers"
  value       = module.ec2_web[*].ec2_public_ip
}

output "app_private_ips" {
  description = "Private IPs of app servers"
  value       = module.ec2_app[*].ec2_private_ip
}

output "db_port" {
  value = module.rds.db_port
}




