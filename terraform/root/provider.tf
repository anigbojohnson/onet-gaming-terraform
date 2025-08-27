terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.98.0"  # Use a compatible 5.x version, or pin it as needed
    }
  }

  required_version = ">= 1.5.0"  # Optional, but good practice to enforce Terraform version
}

provider "aws" {
  region = var.region
}
