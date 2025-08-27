output "db_endpoint" {
  value = split(":", aws_db_instance.rds_instance.endpoint)[0]
}

output "db_username" {
  value = var.db_username
}

output "db_password" {
  value = var.db_password
  sensitive = true
}

output "db_name" {
  value = var.db_name
}
