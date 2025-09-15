# Reference the existing bucket
data "aws_s3_bucket" "existing" {
  bucket = var.bucket_name
}

# Configure static website hosting
resource "aws_s3_bucket_website_configuration" "website" {
  bucket = data.aws_s3_bucket.existing.id

  index_document {
  suffix = "${var.website_content_dir}/index.html"
  }

}

resource "aws_s3_bucket_public_access_block" "website" {
  bucket = data.aws_s3_bucket.existing.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}


# Public bucket policy to allow website access
resource "aws_s3_bucket_policy" "website_policy" {
  bucket = data.aws_s3_bucket.existing.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "arn:aws:s3:::${data.aws_s3_bucket.existing.id}/${var.website_content_dir}/*"
      }
    ]
  })
}
