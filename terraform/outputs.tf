output "apprunner_url" {
  description = "App Runner origin URL (used by CloudFront; not for end users)."
  value       = aws_apprunner_service.app.service_url
}

output "cloudfront_domain" {
  description = "CloudFront distribution domain. Point your DNS here, or use this directly if no custom domain was configured."
  value       = aws_cloudfront_distribution.cdn.domain_name
}

output "cloudfront_distribution_id" {
  description = "Pass this to CI as CLOUDFRONT_DISTRIBUTION_ID for cache invalidation."
  value       = aws_cloudfront_distribution.cdn.id
}

output "ecr_repository_url" {
  description = "ECR repo URL. Use this in CI to tag/push images."
  value       = aws_ecr_repository.app.repository_url
}

output "github_actions_role_arn" {
  description = "IAM role ARN for GitHub Actions OIDC. Set as AWS_ROLE_ARN secret in the repo."
  value       = var.github_repo != "" ? aws_iam_role.github_actions[0].arn : null
}
