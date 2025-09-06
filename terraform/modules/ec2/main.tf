resource "aws_instance" "this" {
  ami                         = var.ami_id
  instance_type               = var.instance_type
  subnet_id                   = var.subnet_id
  vpc_security_group_ids      = [var.security_group]
  key_name                    = var.key_name
  iam_instance_profile        = var.iam_instance_profile

   user_data = <<-EOF
              #!/bin/bash
              # Update packages
              yum update -y

              # Install Python 3.8
              amazon-linux-extras enable python3.8
              yum install -y python3.8

              # Optional: set python3.8 as default
              alternatives --install /usr/bin/python3 python3 /usr/bin/python3.8 1
              EOF


  tags = {
    Name = "${var.project_name}-ec2"
  }
}
