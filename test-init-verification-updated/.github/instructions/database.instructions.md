---
applyTo: "**/prisma/**,**/*.sql,**/migrations/**,**/schema.*,**/db/**"
---

# Database Guidelines

## Schema Design
- UUID or ULID for primary keys
- Timestamps: createdAt, updatedAt on all tables
- Soft delete with deletedAt when needed

## Queries
- Use parameterized queries only (never string concat)
- Select only needed fields
- Use cursor-based pagination for large datasets

## Prisma
- Use transactions for multi-table operations
- Define indexes for frequently queried fields
- Use `@map` and `@@map` for legacy schemas

## Migrations
- One migration per feature
- Never modify already-applied migrations
- Test migrations on copy of production data
