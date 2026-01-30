---
applyTo: "**/prisma/**,**/migrations/**"
---

# Database & Prisma Guidelines

## Schema Design

- Use singular model names (`User`, not `Users`)
- Use `@id` with `@default(cuid())` or `@default(uuid())`
- Add `createdAt` and `updatedAt` to all models
- Use `@relation` explicitly with `onDelete` behavior

## Example Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([authorId])
}
```

## Migrations

- Name migrations descriptively: `add_user_avatar`, `create_order_table`
- Never edit applied migrations
- Test migrations on a copy of production data
- Use `prisma migrate dev` for development, `prisma migrate deploy` for production

## Query Patterns

```typescript
// ✅ Good: Select only needed fields
const user = await prisma.user.findUnique({
  where: { id },
  select: { id: true, email: true, name: true }
});

// ✅ Good: Use transactions for related operations
await prisma.$transaction([
  prisma.user.update({ where: { id }, data: { balance: { decrement: 100 } } }),
  prisma.order.create({ data: { userId: id, total: 100 } })
]);

// ❌ Bad: N+1 queries
const users = await prisma.user.findMany();
for (const user of users) {
  const posts = await prisma.post.findMany({ where: { authorId: user.id } });
}
```

## Indexing

- Add indexes for frequently queried fields
- Add indexes for foreign keys
- Use composite indexes for common query patterns
- Monitor slow queries and add indexes as needed
