output "alb_dns_name" {
  description = "The DNS name of the Application Load Balancer"
  value       = aws_lb.application_load_balancer.dns_name
}

output "alb_zone_id" {
  description = "The canonical hosted zone ID of the load balancer"
  value       = aws_lb.application_load_balancer.zone_id
}

output "alb_arn" {
  description = "The ARN of the load balancer"
  value       = aws_lb.application_load_balancer.arn
}

output "tgt_arn" {
  description = "The ARN of the load balancer target group"
  value       = aws_lb_target_group.alb_target_group.arn
}

