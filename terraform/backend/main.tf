provider "aws" {
  region = "eu-west-1"
}

module "tfstate_backend" {
  source        = "git@bitbucket.org:capricornhqdev/terraform-module-aws-tfstate.git?ref=master"
  region        = var.region
  namespace     = var.namespace
  stage         = var.stage
  name          = var.name
  force_destroy = true
}