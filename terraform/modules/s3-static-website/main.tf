resource "aws_s3_bucket" "website" {
  bucket = var.domain_name
  acl    = "public-read"

  website {
    index_document = "index.html"
  }

  tags = {
    Name = "static_onet_website"
  }
}

resource "aws_s3_bucket_policy" "website_policy" {
  bucket = aws_s3_bucket.website.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = "*"
        Action = "s3:GetObject"
        Resource = "${aws_s3_bucket.website.arn}/*"
      }
    ]
  })
}
