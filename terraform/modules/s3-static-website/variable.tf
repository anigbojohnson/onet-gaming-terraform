variable "domain_name" {
  description = "Your domain name"
  type        = string
}

variable "region" {
  description = "AWS region"
  type        = string
  default     = "eu-west-2"
}

variable "website_content_dir" {
  description = "Local path to your website content"
  type        = string
}




