project_name = "onet-gaming-app"
region = "eu-west-2"

vpc_cidr        = "10.0.0.0/16"

pub_sub_1a_cidr = "10.0.1.0/24"
priv_sub_2a_cidr = "10.0.3.0/24"
priv_sub_3a_cidr = "10.0.5.0/24"


pub_sub_1b_cidr = "10.0.2.0/24"
priv_sub_2b_cidr = "10.0.4.0/24"
priv_sub_3b_cidr = "10.0.6.0/24"

db_username = "admin"
db_password = "Charis123$"


ami_id = "ami-03b485fe5585f0936"
instance_type = "t2.micro"  

db_name = "onet_gaming_app"

s3_website_endpoint = "mydomain19871027.com.s3-website-eu-west-2.amazonaws.com" 
s3_website_zone_id  = "Z3GKZC51ZF0DB4"   # eu-west-2 — you can override if needed
domain_name = "onet-gaming.com"

db_subnet_group_name   = "my-db-subnet-group"



