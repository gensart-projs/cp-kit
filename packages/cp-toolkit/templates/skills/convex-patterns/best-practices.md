# Convex Best Practices

- Schema design: favor flatter documents for common queries; add secondary collections for denormalized read patterns when necessary.
- Indexing & querying: ensure frequently-used query fields are efficient; paginate large lists.
- Performance: batch writes when possible; avoid per-item network round-trips.
- LLMs & embeddings: store only references to embeddings in Convex and use an external vector DB for similarity search at scale.
- Security: sanitize and validate all inputs, and enforce access control in Convex functions.
- Observability: emit structured logs/metrics from functions and monitor reaction/update latency.
- Migrations: provide backward-compatible migrations and a clear migration plan for schema changes.

## Checklist Before Production
- [ ] Auth rules embedded and tested
- [ ] Danger zones identified (hot paths) & load-tested
- [ ] Client subscriptions tested for reactivity under load
- [ ] External services (vector DBs, model providers) have clear SLAs and retry strategies
