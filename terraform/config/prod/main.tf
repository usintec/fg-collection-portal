provider "aws" {
  region = var.region
}

terraform {
  backend "s3" {
    region         = "eu-west-1"
    bucket         = "admin-bap-qa-state"
    key            = "terraform.tfstate"
    dynamodb_table = "admin-bap-qa-state-lock"
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
  cors_allowed_origins     = ["*.baxibap.com"]
  cors_expose_headers      = ["ETag"]
  aliases                  = ["admin.staging.baxibap.com"]
  acm_certificate_arn      = "arn:aws:acm:us-east-1:240725571218:certificate/b1d5c115-03eb-40ed-9d98-fadea662326d"
  # web_acl_id               = "arn:aws:wafv2:us-east-1:907282080686:global/webacl/infra-cloudfront/bfd0c8fa-89cf-4ca8-9775-ac88b1a031d3"
  parent_zone_id           = "Z10242841172O4Q6H49T9"
  headers = {
    enabled                  = true
    hsts-enabled             = true
    x-content-type-enabled   = true
    x-frame-options-enabled  = true
    x-xss-protection-enabled = true
 }
}
