# Reference the existing bucket
data "aws_s3_bucket" "existing" {
  bucket = var.domain_name
}

# Configure static website hosting
resource "aws_s3_bucket_website_configuration" "website" {
  bucket = data.aws_s3_bucket.existing.id

  index_document {
  suffix = "website/index.html"
  }


  error_document {
    key = "error.html"
  }
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
        Resource  = "arn:aws:s3:::${data.aws_s3_bucket.existing.id}/website/*"
      }
    ]
  })
}
