variable "domain_name" {
  description = "The domain name for the Route53 zone and certificate"
  type        = string
}

variable "alb_arn" {
  description = "The ARN of the Application Load Balancer"
  type        = string
}
variable "hosted_zone_id" {
  
}

variable "tg_arn" {
}
