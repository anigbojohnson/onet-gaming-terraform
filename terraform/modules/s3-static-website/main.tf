resource "aws_s3_bucket" "create-bucket" {
  bucket = var.bucket_name
}


resource "aws_s3_bucket_website_configuration" "website" {
  bucket = aws_s3_bucket.create-bucket.id

  index_document {
    suffix = "onet.html"
  }


}

resource "aws_s3_bucket_public_access_block" "website" {
  bucket = aws_s3_bucket.create-bucket.id
  block_public_acls       = true
  block_public_policy     = false
  ignore_public_acls      = true
  restrict_public_buckets = false
}


resource "aws_s3_bucket_policy" "website_policy" {
  bucket = aws_s3_bucket.create-bucket.id


  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "arn:aws:s3:::${aws_s3_bucket.create-bucket.id}/*"
      }
    ]
  })
  depends_on = [aws_s3_bucket_public_access_block.website]

}
