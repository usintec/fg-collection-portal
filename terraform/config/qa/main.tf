provider "aws" {
  region = var.region
}

terraform {
  backend "s3" {
    region         = "eu-west-1"
    bucket         = "portal-fg-qa-state"
    key            = "terraform.tfstate"
    dynamodb_table = "portal-fg-qa-state-lock"
    encrypt        = true
  }
}

module "cloudfront_s3_cdn" {
  source                   = "git@bitbucket.org:capricornhqdev/terraform-module-aws-cloudfront.git?ref=master"
  namespace                = var.namespace
  stage                    = var.stage
  name                     = var.name
  use_regional_s3_endpoint = true
  origin_force_destroy     = true
  cors_allowed_headers     = ["*"]
  minimum_protocol_version  = "TLSv1.2_2021"
  min_ttl                  = 1
  max_ttl                  = 120
  cors_allowed_methods     = ["GET", "HEAD", "PUT"]
  cors_allowed_origins     = ["*.baxi-services.com"]
  cors_expose_headers      = ["ETag"]
  aliases                  = ["portal.dev.baxi-services.com"]
  acm_certificate_arn      = "arn:aws:acm:us-east-1:907282080686:certificate/d3d4ad7b-e6fc-450b-86ef-aa2854261e66"
  web_acl_id               = "arn:aws:wafv2:eu-west-1:907282080686:regional/webacl/platforms-alb/efd2f01b-2981-48e9-88ad-9dfcd32489d5"
  parent_zone_id           = "Z05718101XSWIHCXU9R1H"
  headers = {
    enabled                  = true
    hsts-enabled             = true
    x-content-type-enabled   = true
    x-frame-options-enabled  = true
    x-xss-protection-enabled = true
 }
}
