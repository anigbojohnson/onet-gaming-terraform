variable "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  type        = string
}

variable "alb_zone_id" {
  description = "Canonical hosted zone ID of the Application Load Balancer"
  type        = string
}

variable "s3_website_endpoint" {
  
}

variable "s3_website_zone_id" {
  
}

variable "domain_name" {
  description = "The domain name for the application and ACM certificate"
  type        = string
}
