variable "project_name" {
  description = "Project name for the VPC"
  type        = string
}

variable "db_sg_id" {
  description = "Security Group ID for the RDS instance"
  type        = string
}

variable "db_subnet_1a_id" {
  description = "Private subnet ID in AZ1 for the RDS instance"
  type        = string
}

variable "db_subnet_1b_id" {
  description = "Private subnet ID in AZ2 for the RDS instance"
  type        = string
}

variable "db_username" {
  description = "Master username for the RDS instance"
  type        = string
}

variable "db_password" {
  description = "Master password for the RDS instance"
  type        = string
  sensitive   = true
}

variable "db_subnet_group_name" {
  description = "Name of the RDS subnet group spanning subnets in AZ-a and AZ-b"
  type        = string
}

variable "db_name" {
  
}
