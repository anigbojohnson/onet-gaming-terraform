variable project_name {}
variable web_alb_sg_id {}
variable app_sg_id {
  
}
variable public_subnet_1a_id {}
variable public_subnet_1b_id {}

variable app_subnet_1a_id {}
variable app_subnet_1b_id {}
variable vpc_id {}
variable "web_aws_instance_ids" {
  description = "List of EC2 instance IDs to register with the internet-facing ALB target group"
  type        = list(string)
}
variable "app_aws_instance_ids" {
  description = "List of EC2 instance IDs to register with the internal ALB target group"
  type        = list(string)
}
