resource "aws_route53_zone" "main_zone" {
  name = var.domain_name
}

resource "aws_route53_health_check" "alb_health_check" {
  fqdn              = var.alb_dns_name
  port              = 443
  type              = "HTTPS"
  resource_path     = "/health"
  failure_threshold = 3
  request_interval  = 30

  tags = {
    Name = "alb-health-check"
  }
}



resource "aws_route53_record" "app_primary_record" {
  zone_id = aws_route53_zone.main_zone.zone_id
  name    = ""
  type    = "A"
  set_identifier = "primary-alb-record"

  alias {
    name                   = "${var.alb_dns_name}"
    zone_id                = var.alb_zone_id
    evaluate_target_health = true
  }

  failover_routing_policy {
    type = "PRIMARY"  # Must be PRIMARY or SECONDARY
  }

  health_check_id = aws_route53_health_check.alb_health_check.id
}


resource "aws_route53_record" "app_secondary_record" {
  zone_id = aws_route53_zone.main_zone.zone_id
  name    = ""
  type    = "A"
  set_identifier = "secondary-record"

  alias {
    name    = "mydomain19871027.com.s3-website.eu-west-2.amazonaws.com"  # S3 Website Endpoint
    zone_id = "Z3GKZC51ZF0DB4"  # Correct for eu-west-2
    evaluate_target_health = false
  }

   failover_routing_policy {
    type = "SECONDARY"
  }
}

