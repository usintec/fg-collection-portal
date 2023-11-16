#!/bin/bash

cd ./terraform/backend/ &&
     if aws s3 ls "s3://portal-fg-qa-state" 2>&1 | grep -q 'NoSuchBucket';
     then terraform init -input=false &&
     terraform plan -input=false -out=../config/qa/out.state -var-file=../config/qa/terraform.tfvars &&
     terraform apply -input=false -auto-approve "../config/qa/out.state";
     fi &&
     cd ../config/qa/ &&
     terraform init -input=false &&
     terraform plan -input=false -out=main.state &&
     terraform apply -input=false -auto-approve "main.state" &&
     echo "Done"
