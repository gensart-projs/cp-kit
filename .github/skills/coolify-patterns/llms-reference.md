# Coolify — Quick Reference

This file summarizes key patterns for using Coolify as a self-hosted PaaS. It is concise and oriented to operational decision-making. Use the official docs at https://coolify.io/docs/llms.txt for full guidance.

## Key Concepts
- Coolify = simple self-hosted PaaS for Apps | Repos → builds → deploys
- Use Coolify to manage builds, environment variables, SSL, and simple runtime orchestration
- Prefer external services for stateful data (databases, object storage)

## Common Patterns
1. Reproducible builds
- Pin image tags or use build outputs with deterministic steps

2. Secrets & environment
- Use Coolify's secret management and do not commit secrets to repo

3. Health & scaling
- Configure health checks, resource limits, and consider replicas for critical services

4. Backups & restores
- Ensure DBs and storage have independent backup strategies and run restore drills

## Short Example
```bash
# Trigger a build and deploy using Coolify CLI or API (pseudocode)
coolify deploy --app my-app --branch main
```

## Where to get more details
- Official Coolify docs: https://coolify.io/docs/llms.txt

*(Keep this file short; pull the canonical doc for deeper details.)*
