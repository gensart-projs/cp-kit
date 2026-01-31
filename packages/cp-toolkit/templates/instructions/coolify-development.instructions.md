---
name: coolify-development
description: Guidelines for deploying and operating applications with Coolify.
version: 1.0
applyTo: "**/coolify/**,**/deploy/**,**/Dockerfile,**/docker-compose.*"
---

## Coolify Development Guidelines

> Checklist and rules for safe Coolify deployments.

### Style & Safety
- Use secure secret management (do not commit secrets)
- Validate container builds and runtime configs

### Operations
- Configure backups and verify restore procedures
- Add monitoring and alerting for application health

### CI/CD
- Trigger deployments from validated CI pipelines
- Keep deploy steps idempotent and test rollback paths
