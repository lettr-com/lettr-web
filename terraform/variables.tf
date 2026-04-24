variable "aws_region" {
  description = "AWS region for App Runner + ECR. Pick the region closest to your largest user base."
  type        = string
  default     = "eu-central-1"
}

variable "project_name" {
  description = "Used as the name prefix for ECR, App Runner, IAM roles, etc."
  type        = string
  default     = "lettr-web"
}

variable "image_tag" {
  description = "ECR image tag that App Runner will track. Leave as :latest for continuous deploys from CI."
  type        = string
  default     = "latest"
}

variable "domain_name" {
  description = "Optional custom domain (e.g. lettr.io). Leave empty to use the CloudFront default *.cloudfront.net URL."
  type        = string
  default     = ""
}

variable "route53_zone_id" {
  description = "Optional Route 53 hosted zone id for domain_name. If empty and domain_name is set, you must configure DNS/cert validation manually."
  type        = string
  default     = ""
}

variable "zaptime_token" {
  description = "Zaptime API token (server-side)"
  type        = string
  sensitive   = true
}

variable "zaptime_base_url" {
  description = "Zaptime API base URL"
  type        = string
  default     = "https://api.zaptime.com/"
}

variable "turnstile_secret" {
  description = "Cloudflare Turnstile secret key for booking captcha verification"
  type        = string
  sensitive   = true
}

variable "github_repo" {
  description = "owner/repo — used to scope the OIDC role assumed by GitHub Actions. Leave empty to skip OIDC setup."
  type        = string
  default     = ""
}
