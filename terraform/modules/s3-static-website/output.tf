# Outputs

data "aws_s3_bucket" "existing" {
  bucket = aws_s3_bucket.existing
}
output "s3_website_endpoint" {
  value = data.aws_s3_bucket_website_configuration.website.s3_website_endpoint
}

output "s3_website_zone_id" {
  value = data.aws_s3_bucket_website_configuration.website.hosted_zone_id
}
