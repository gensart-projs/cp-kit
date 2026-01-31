# Coolify Best Practices

- Confirm reproducible builds and pinned dependencies
- Centralize secrets in Coolify's secret manager or a dedicated vault
- Automate backups for stateful services (DBs, object storage)
- Configure monitoring and alerts for critical paths
- Test rollback and restore procedures periodically

## Pre-Production Checklist
- [ ] Secrets not in repo
- [ ] Health checks implemented
- [ ] Backup plan verified
- [ ] Resource limits applied
- [ ] CI triggers deployment after tests
