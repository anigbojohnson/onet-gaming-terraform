
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
    apt-get update -y
    apt-get upgrade -y

    # Install Python 3 and pip (should already be present, but just in case)
    apt-get install -y python3 python3-pip

    # Verify installation (logs to /var/log/cloud-init-output.log)
    python3 --version
  EOF

  tags = {
    Name = "${var.project_name}-ec2"
  }
}
