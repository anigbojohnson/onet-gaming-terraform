# create application load balancer
resource "aws_lb" "application_load_balancer" {
  name               = "${var.project_name}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.web_alb_sg_id]
  subnets            = [var.public_subnet_1a_id,var.public_subnet_1b_id]
  enable_deletion_protection = false

  tags   = {
    Name = "${var.project_name}-alb"
  }
}

# create target group
resource "aws_lb_target_group" "alb_target_group" {
  name        = "${var.project_name}-tg"
  target_type = "instance"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = var.vpc_id

  health_check {
    enabled             = true
    interval            = 300
    path                = "/"
    timeout             = 60
    matcher             = 200
    healthy_threshold   = 2
    unhealthy_threshold = 5
  }

  lifecycle {
    create_before_destroy = true
  }
}

# HTTP listener on port 80 — redirects to HTTPS (301 Permanent)
resource "aws_lb_listener" "http_listener" {
  load_balancer_arn = aws_lb.application_load_balancer.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.alb_target_group.arn
  }
}

resource "aws_lb_target_group_attachment" "web_targets" {
  count            = length(var.web_aws_instance_ids)
  target_group_arn = aws_lb_target_group.alb_target_group.arn
  target_id        = var.web_aws_instance_ids[count.index]
  port             = 80
}






# Internal Application Load Balancer
resource "aws_lb" "internal_alb" {
  name               = "${var.project_name}-internal-alb"
  internal           = true
  load_balancer_type = "application"
  security_groups    = [var.app_sg_id] # security group that allows only web tier SG inbound
  subnets            = [var.app_subnet_1a_id, var.app_subnet_1b_id]
  enable_deletion_protection = false

  tags = {
    Name = "${var.project_name}-internal-alb"
  }
}

# Internal Target Group for Node.js App
resource "aws_lb_target_group" "internal_tg" {
  name        = "${var.project_name}-internal-tg"
  target_type = "instance"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = var.vpc_id

  health_check {
    enabled             = true
    interval            = 30
    path                = "/health"
    timeout             = 5
    matcher             = "200"
    healthy_threshold   = 2
    unhealthy_threshold = 5
  }

  lifecycle {
    create_before_destroy = true
  }
}

# Attach App EC2s to Internal Target Group
resource "aws_lb_target_group_attachment" "app_targets" {
  count            = length(var.app_aws_instance_ids)
  target_group_arn = aws_lb_target_group.internal_tg.arn
  target_id        = var.app_aws_instance_ids[count.index]
  port             = 3000
}

# Internal ALB Listener
resource "aws_lb_listener" "internal_http" {
  load_balancer_arn = aws_lb.internal_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.internal_tg.arn
  }
}
