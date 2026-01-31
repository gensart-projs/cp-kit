# Convex + LLMs — Quick Reference

This file summarizes patterns for using Convex alongside LLMs. It is intentionally concise and decision-focused — keep the official docs as the source of truth.

## Key Concepts

- Convex excels as a **realtime persistent store and reactive query engine**. Use Convex for application state and coordination.
- For heavy ML workloads (embeddings, vector search, inference), prefer **external specialized services** and store references/metadata in Convex.
- Use Convex **Functions** for short server-side logic (validation, small transformations, enqueuing jobs), but avoid long-running inference inside them.

## Common Patterns

1. Conversation state
- Store messages and metadata as Convex documents (conversation id, message list or paginated messages).
- Keep embeddings out of primary documents when large; store embedding ids or pointers.

2. Retrieval + LLM
- Store document metadata & source pointers in Convex.
- Use an external vector store for embeddings and perform retrieval outside Convex; use Convex functions to orchestrate retrieval and ephemeral composition.

3. Streaming and Realtime
- Use Convex reactive queries and subscriptions to stream incremental updates to clients.
- For streaming LLM responses, append partial tokens to a conversation document and broadcast via subscriptions.

4. Security
- Validate and sanitize user inputs in Convex functions.
- Enforce auth checks and role-based access on mutations.

## Short Example (JS)

```javascript
// Pseudocode — adapt to your project
import { ConvexHttpClient } from "convex/http"; // placeholder
const convex = new ConvexHttpClient(process.env.CONVEX_URL);

// Append a message (mutation)
await convex.mutation('messages.add', { conversationId, userId, text });

// Reactive query (client)
const messages = await convex.query('messages.forConversation', { conversationId });
```

## Where to get more details
- Official Convex docs: https://docs.convex.dev
- Convex llms guide (canonical): https://www.convex.dev/llms.txt (use this skill's `scripts/sync-docs.py` to pull a fresh copy if desired)

*(This file is a summary — consult the official docs for API changes or detailed examples.)*