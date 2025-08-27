variable "project_name" {
  description = "Project name for the VPC"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
}

variable "pub_sub_1a_cidr" {
  description = "CIDR block for public subnet 1a"
  type        = string
}

variable "pub_sub_1b_cidr" {
  description = "CIDR block for public subnet 1b"
  type        = string
}

variable "priv_sub_2a_cidr" {
  description = "CIDR block for private subnet 2a"
  type        = string
}

variable "priv_sub_2b_cidr" {
  description = "CIDR block for private subnet 2b"
  type        = string
}

variable "priv_sub_3a_cidr" {
  description = "CIDR block for private subnet 3a"
  type        = string
}

variable "priv_sub_3b_cidr" {
  description = "CIDR block for private subnet 3b"
  type        = string
}