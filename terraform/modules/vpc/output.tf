output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.vpc.id
}

output "igw_id" {
  description = "The ID of the Internet Gateway"
  value       = aws_internet_gateway.igw.id
}

output "public_subnet_1a_id" {
  description = "Public Subnet 1a ID"
  value       = aws_subnet.public_subnet_1a.id
}

output "public_subnet_1b_id" {
  description = "Public Subnet 1b ID"
  value       = aws_subnet.public_subnet_1b.id
}

output "app_subnet_1a_id" {
  description = "App Subnet 1a ID"
  value       = aws_subnet.private_subnet_app_1a.id
}

output "app_subnet_1b_id" {
  description = "App Subnet 1b ID"
  value       = aws_subnet.private_subnet_app_1b.id
}

output "db_subnet_1a_id" {
  description = "Database Subnet 1a ID"
  value       = aws_subnet.private_subnet_db_1a.id
}

output "db_subnet_1b_id" {
  description = "Database Subnet 1b ID"
  value       = aws_subnet.private_subnet_db_1b.id
}

output "private_subnet_ids" {
  value = [
    aws_subnet.private_subnet_app_1a.id,
    aws_subnet.private_subnet_app_1b.id,
     aws_subnet.private_subnet_db_1b.id,
     aws_subnet.private_subnet_db_1a.id,
  ]
}

output "public_subnet_ids" {
  value = [
    aws_subnet.public_subnet_1a.id,
    aws_subnet.public_subnet_1b.id
  ]
}

