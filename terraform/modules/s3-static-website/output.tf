# Outputs
output "s3_website_endpoint" {
  value = aws_s3_bucket_website_configuration.website.website_endpoint
}

output "s3_website_zone_id" {
  value = aws_s3_bucket_website_configuration.website.hosted_zone_id
}
