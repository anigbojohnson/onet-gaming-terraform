variable "public_subnet_ids" {}
variable "app_subnet_1a_id" {}
variable "app_subnet_1b_id" {}
variable "db_subnet_1a_id" {}
variable "db_subnet_1b_id" {}
variable "igw_id" {}
variable "vpc_id" {}
variable "private_subnet_ids" {
  
}
variable "project_name" {
  description = "Project name for the NAT resources"
  type        = string
}
