---
name: database-development
description: Standards for schema design, query optimization, and database migrations.
version: 1.0
applyTo: "**/prisma/**,**/*.sql,**/migrations/**,**/schema.*,**/db/**,**/models/**"
---

# Database Development Guidelines

## Schema Design
- UUID or ULID for primary keys (not auto-increment)
- Timestamps: createdAt, updatedAt on all tables
- Soft delete with deletedAt when needed
- Proper foreign key relationships
- Normalized schemas with good indexing

## Query Optimization
- Use parameterized queries only (never string concat)
- Select only needed fields (avoid SELECT *)
- Use cursor-based pagination for large datasets
- Proper indexing on frequently queried fields
- Query execution plan analysis

## ORM Best Practices
- Use transactions for multi-table operations
- N+1 query problem avoidance
- Proper eager/lazy loading
- Migration scripts for schema changes
- Database constraints and validations

## Migration Safety
- One migration per feature/change
- Never modify already-applied migrations
- Test migrations on production-like data
- Rollback scripts for emergency recovery
- Version control for migration files

## Performance
- Connection pooling configuration
- Query result caching strategies
- Database indexing strategy
- Read/write splitting when appropriate
- Monitoring and alerting setup
