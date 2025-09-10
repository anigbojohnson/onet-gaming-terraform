output "alb_dns_name" {
  description = "The DNS name of the Application Load Balancer"
  value       = aws_lb.application_load_balancer.dns_name
}

output "alb_zone_id" {
  description = "The canonical hosted zone ID of the load balancer"
  value       = aws_lb.application_load_balancer.zone_id
}

output "alb_internet_facing_dns" {
  description = "The dns name of internet facing load balancer"
  value       = aws_lb.application_load_balancer.dns_name
}

output "alb_internal_arn" {
  description = "The dns name of internal of load balancer"
  value       = aws_lb.internal_alb.dns_name
}

output "tgt_arn" {
  description = "The ARN of the load balancer target group"
  value       = aws_lb_target_group.alb_target_group.arn
}

