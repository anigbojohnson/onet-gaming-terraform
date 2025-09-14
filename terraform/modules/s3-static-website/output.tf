
# Get website configuration
data "aws_s3_bucket_website_configuration" "existing" {
  bucket = data.aws_s3_bucket.existing.id
}

# Outputs
output "s3_website_endpoint" {
  value = data.aws_s3_bucket_website_configuration.existing.website_endpoint
}

output "s3_website_zone_id" {
  value = data.aws_s3_bucket_website_configuration.existing.hosted_zone_id
}
