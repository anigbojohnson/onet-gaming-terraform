######################################
# Web Tier Security Group
######################################
resource "aws_security_group" "web_sg" {
  name        = "web_sg"
  description = "Web tier instances receiving traffic from public ALB"
  vpc_id      = var.vpc_id

  ingress {
    description     = "Allow HTTP from public ALB"
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_public_sg.id]
  }

  ingress {
    description     = "Allow HTTPS from public ALB"
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_public_sg.id]
  }

  ingress {
    description = "Allow SSH from trusted IPs "
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] 
  }
  

  egress {
    description = "Allow outbound to internal ALB and internet"
    from_port   = 0
    to_port     = 0
    protocol    = -1
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "web_sg"
    Tier = "web"
  }
}

######################################
# Public ALB (Internet-facing)
######################################
resource "aws_security_group" "alb_public_sg" {
  name        = "alb_public_sg"
  description = "Public ALB accepting internet traffic"
  vpc_id      = var.vpc_id

  ingress {
    description = "Allow HTTP from anywhere"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow HTTPS from anywhere"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Forward traffic to web tier"
    from_port   = 0
    to_port     = 0
    protocol    = -1
    cidr_blocks = ["0.0.0.0/0"]

  }

  tags = {
    Name = "alb_public_sg"
    Tier = "loadbalancer-public"
  }
}

######################################
# Internal ALB (Private)
######################################
resource "aws_security_group" "alb_internal_sg" {
  name        = "alb_internal_sg"
  description = "Internal ALB only accessible from web tier"
  vpc_id      = var.vpc_id

  ingress {
    description     = "Allow HTTP from web tier"
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.web_sg.id]
  }

  ingress {
    description     = "Allow HTTPS from web tier"
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    security_groups = [aws_security_group.web_sg.id]
  }

  egress {
    description = "Forward traffic to app layer"
    from_port   = 0
    to_port     = 0
    protocol    = -1
    cidr_blocks = ["0.0.0.0/0"]

  }

  tags = {
    Name = "alb_internal_sg"
    Tier = "loadbalancer-internal"
  }
}

######################################
# Application Layer (Node.js)
######################################
resource "aws_security_group" "app_sg" {
  name        = "app_sg"
  description = "App tier instances receiving traffic from internal ALB"
  vpc_id      = var.vpc_id

  ingress {
    description     = "App traffic from internal ALB"
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_internal_sg.id]
  }

  ingress {
  description     = "SSH from web tier as bastion host"
  from_port       = 22
  to_port         = 22
  protocol        = "tcp"
  security_groups = [aws_security_group.web_sg.id]
}


  egress {
    description = "Allow outbound to DB and internet"
    from_port   = 0
    to_port     = 0
    protocol    = -1
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "app_sg"
    Tier = "app"
  }
}

######################################
# Database Layer (RDS PostgreSQL)
######################################
resource "aws_security_group" "db_sg" {
  name        = "db_sg"
  description = "RDS PostgreSQL only accessible from app layer"
  vpc_id      = var.vpc_id

  ingress {
    description     = "PostgreSQL access from app tier"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.app_sg.id]
  }

  egress {
    description = "Allow outbound (optional)"
    from_port   = 0
    to_port     = 0
    protocol    = -1
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "db_sg"
    Tier = "db"
  }
}
