resource "aws_db_subnet_group" "db_subnet" {
  name       = var.db_subnet_group_name
  subnet_ids = [var.db_subnet_1a_id, var.db_subnet_1b_id] # Replace with your private subnet IDs

   tags = {
    Name = var.db_subnet_group_name
  }
}

resource "aws_db_instance" "rds_instance" {
  identifier              = "${var.project_name}-db"
  allocated_storage       = 20
  engine                  = "mysql"
  engine_version          = "8.0"
  instance_class          = "db.t3.micro"
  username                = var.db_username
  password                = var.db_password
  db_name                 = var.db_name
  db_subnet_group_name    = aws_db_subnet_group.db_subnet.name
  vpc_security_group_ids  = [var.db_sg_id]
  skip_final_snapshot     = true
  publicly_accessible     = false
  multi_az                = false
  backup_retention_period = 7

  tags = {
    Name = "${var.project_name}-db"
  }
}
