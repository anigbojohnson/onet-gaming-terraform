# Reference the existing bucket
data "aws_s3_bucket" "existing" {
  bucket = var.domain_name
}

# Configure static website hosting
resource "aws_s3_bucket_website_configuration" "website" {
  bucket = data.aws_s3_bucket.existing.id

  index_document {
  suffix = "${var.website_content_dir}/index.html"
  }

}


