variable "aws_region" {
  description = "AWS region for the S3 bucket. CloudFront/ACM always live in us-east-1."
  type        = string
  default     = "eu-central-1"
}

variable "project_name" {
  description = "Used as the name prefix for S3, CloudFront, IAM roles, etc."
  type        = string
  default     = "lettr-web"
}

variable "bucket_name" {
  description = "Override the default S3 bucket name. Leave empty to use \"{project_name}-<account_id>\"."
  type        = string
  default     = ""
}

variable "domain_name" {
  description = "Optional custom domain (e.g. lettr.com). Leave empty to use the CloudFront default *.cloudfront.net URL."
  type        = string
  default     = ""
}

variable "route53_zone_id" {
  description = "Optional Route 53 hosted zone id for domain_name. If empty and domain_name is set, you must configure DNS/cert validation manually."
  type        = string
  default     = ""
}

variable "github_repo" {
  description = "owner/repo — used to scope the OIDC role assumed by GitHub Actions. Leave empty to skip OIDC setup."
  type        = string
  default     = ""
}
