resource "aws_instance" "this" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  subnet_id              = var.subnet_id
  vpc_security_group_ids = [var.security_group]
  key_name               = var.key_name
  iam_instance_profile   = var.iam_instance_profile

  user_data = <<-EOF
    #!/bin/bash
    set -xe

    # Update all packages
    yum update -y

    # Enable Amazon Linux Extras for python3.9
    amazon-linux-extras enable python3.9

    # Refresh yum cache
    yum clean metadata
    yum install -y python39 python39-pip

    # Fix symlink for python3
    alternatives --install /usr/bin/python3 python3 /usr/bin/python3.9 1
    alternatives --set python3 /usr/bin/python3.9

    # Verify installation (logs to /var/log/cloud-init-output.log)
    python3 --version
  EOF

  tags = {
    Name = "${var.project_name}-ec2"
  }
}
