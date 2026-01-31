---
name: github-actions
description: Standards for GitHub Actions workflows including security, performance, and best practices.
applyTo: ".github/workflows/**/*.yml,.github/workflows/**/*.yaml"
---

# GitHub Actions Development Guidelines

## Workflow Structure
- Descriptive workflow names and jobs
- Matrix builds for multiple environments
- Proper job dependencies with needs
- Conditional execution with if statements
- Timeout settings for long-running jobs

## Security
- Use trusted actions from GitHub Marketplace
- Pin action versions to specific SHAs
- Use secrets for sensitive data
- CodeQL for security scanning
- Dependency review for PRs

## Best Practices
- Cache dependencies for faster builds
- Use self-hosted runners when appropriate
- Proper artifact management
- Notification configuration
- Workflow reusability with composite actions

## CI/CD Pipeline
- Build → Test → Deploy stages
- Parallel job execution
- Failure handling and notifications
- Rollback capabilities
- Environment-specific configurations

## Performance
- Efficient caching strategies
- Minimal artifact sizes
- Parallel job execution
- Resource optimization
- Build time monitoring
