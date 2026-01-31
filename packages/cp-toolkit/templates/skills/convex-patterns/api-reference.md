# Convex API Reference — Essentials

Small set of examples and reminders for common operations.

## Primitives
- Documents: store persistent state as collections of documents
- Queries: reactive reads that update when underlying data changes
- Functions: server-side mutations/logic triggered from clients or other functions
- Auth: enforce access rules in functions and on the client

## Example Patterns

### Basic mutation
```javascript
// Mutation pseudocode
await convex.mutation('messages.add', { conversationId, userId, text });
```

### Query with pagination
```javascript
// Query pseudocode
const page = await convex.query('messages.forConversation', { conversationId, cursor, limit: 50 });
```

### Function orchestration
- Use a Convex function to validate and persist user input, then enqueue external processing (e.g., send to a worker or call an external vectorization service).
- Keep functions idempotent and small.

## Errors & Retries
- Handle transient network errors and provide retries with backoff where appropriate.
- Avoid long-running retries in Convex functions; push heavy retries to external worker systems.

## Testing
- Unit test functions by mocking Convex runtime where possible
- Integration tests should verify query/reactivity in a staging Convex project
