---
name: convex-development
description: Guidelines for working with Convex-backed functions, schemas, and integrations with LLMs.
version: 1.0
applyTo: "**/convex/**,**/functions/**,**/*convex*.*"
---

## Convex Development Guidelines

> Short checklists and rules to follow when adding Convex-backed features.

### Style & Safety
- Validate and sanitize inputs in every mutation/function.
- Explicitly enforce auth and role checks.
- Keep functions idempotent and short.

### LLM Integrations
- Store metadata and pointers in Convex; store embeddings in a vector DB.
- Orchestrate external model calls from Convex functions but run heavy inference outside of Convex where possible.

### Tests & CI
- Unit test functions with mocked Convex environment
- Add small integration tests for query reactivity
- Add performance tests for hot paths

