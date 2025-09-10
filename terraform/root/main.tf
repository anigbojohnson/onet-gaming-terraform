module "vpc" {
  source            = "../modules/vpc"
  project_name      = var.project_name
  vpc_cidr          = var.vpc_cidr
  pub_sub_1a_cidr   = "10.0.1.0/24"
  pub_sub_1b_cidr   = var.pub_sub_1b_cidr
  priv_sub_2a_cidr  = var.priv_sub_2a_cidr
  priv_sub_2b_cidr  = var.priv_sub_2b_cidr
  priv_sub_3a_cidr  = var.priv_sub_3a_cidr
  priv_sub_3b_cidr  = var.priv_sub_3b_cidr
}

module "nat" {
  source = "../modules/nat"
  private_subnet_ids  = module.vpc.private_subnet_ids
  public_subnet_ids    = module.vpc.public_subnet_ids
  igw_id              = module.vpc.igw_id
  vpc_id              = module.vpc.vpc_id
  app_subnet_1a_id    = module.vpc.app_subnet_1a_id
  app_subnet_1b_id    = module.vpc.app_subnet_1b_id
  db_subnet_1a_id     = module.vpc.db_subnet_1a_id
  db_subnet_1b_id     = module.vpc.db_subnet_1b_id
  project_name        = var.project_name
}

module "security-group" {
  source = "../modules/security-group"
  vpc_id = module.vpc.vpc_id
}

# creating Key for instances
module "key" {
  source = "../modules/key"
}

# creating RDS instance
module "rds" {
  source         =  "../modules/rds"
  project_name = var.project_name
  db_sg_id       =  module.security-group.db_sg_id
  db_subnet_1a_id = module.vpc.db_subnet_1a_id
  db_subnet_1b_id = module.vpc.db_subnet_1b_id
  db_username    = var.db_username
  db_password    = var.db_password
  db_subnet_group_name  = var.db_subnet_group_name
  db_name = var.db_name
}


module "ec2_app" {
  source         = "../modules/ec2"
  count         = terraform.workspace == "prod" ? 2 : 1   # 2 in prod, 1 in dev
  project_name   = var.project_name
  ami_id         = var.ami_id
  instance_type  = var.instance_type
  subnet_id      = module.vpc.app_subnet_1b_id  # Private subnet for app servers
  key_name       = module.key.key_name
  security_group = module.security-group.app_sg_id
}


module "ec2_web" {
  source        = "../modules/ec2"
  count         = terraform.workspace == "prod" ? 2 : 1   # 2 in prod, 1 in dev
  project_name  = var.project_name
  ami_id        = var.ami_id
  instance_type = var.instance_type
  subnet_id     = element(
                    [module.vpc.public_subnet_1a_id, module.vpc.public_subnet_1b_id],
                    count.index
                 )
  key_name      = module.key.key_name
  security_group = module.security-group.web_sg_id
}

# Creating Application Load balancer
module "alb" {
  source                = "../modules/alb"
  project_name          = var.project_name
  web_alb_sg_id             = module.security-group.web_sg_id
  app_sg_id   = module.security-group.app_sg_id
  public_subnet_1a_id   = module.vpc.public_subnet_1a_id
  public_subnet_1b_id   = module.vpc.public_subnet_1b_id
  app_subnet_1a_id   = module.vpc.app_subnet_1a_id
  app_subnet_1b_id   = module.vpc.app_subnet_1b_id
  web_aws_instance_ids  = flatten([for m in module.ec2_web : m.instance_ids])
  app_aws_instance_ids  = flatten([for m in module.ec2_app : m.instance_ids])
  vpc_id                = module.vpc.vpc_id
}


# Add record in route 53 hosted zone
module "route53" {
  source = "../modules/route53"
  alb_dns_name = module.alb.alb_dns_name
  alb_zone_id = module.alb.alb_zone_id
  s3_website_endpoint = var.s3_website_endpoint
  s3_website_zone_id = var.s3_website_zone_id
  domain_name = var.domain_name

}

















