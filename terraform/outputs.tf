output "s3_bucket" {
  description = "S3 bucket holding the site. Pass to CI as S3_BUCKET."
  value       = aws_s3_bucket.site.bucket
}

output "cloudfront_domain" {
  description = "CloudFront distribution domain. Point DNS here, or open directly if no custom domain is set."
  value       = aws_cloudfront_distribution.cdn.domain_name
}

output "cloudfront_distribution_id" {
  description = "Pass this to CI as CLOUDFRONT_DISTRIBUTION_ID for cache invalidation."
  value       = aws_cloudfront_distribution.cdn.id
}

output "github_actions_role_arn" {
  description = "IAM role ARN for GitHub Actions OIDC. Set as AWS_ROLE_ARN secret in the repo."
  value       = var.github_repo != "" ? aws_iam_role.github_actions[0].arn : null
}
