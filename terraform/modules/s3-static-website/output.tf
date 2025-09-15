# Outputs
output "s3_website_endpoint" {
  value = aws_s3_bucket_website_configuration.website.website_endpoint
}

output "bucket_arn" {
  value = data.aws_s3_bucket.existing.arn
}

