output "hosted_zone_id" {
  description = "The ID of the Route 53 hosted zone"
  value       = aws_route53_zone.main_zone.zone_id
}