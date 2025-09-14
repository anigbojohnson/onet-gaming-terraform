
terraform { 
    backend "s3" { 
        bucket = "onet-gaming-1987"
        key = "onet/state/terraform.tfstate"
        region = "eu-west-2"
        encrypt = true
        dynamodb_table = "onet-gaming-terraform-lock"
        
        } 
        
    }
