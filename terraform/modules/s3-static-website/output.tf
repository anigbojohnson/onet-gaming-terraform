# Outputs
output "s3_website_endpoint" {
  value = aws_s3_bucket_website_configuration.website.website_domain
}

output "bucket_arn" {
  value = aws_s3_bucket.create-bucket.arn
}