---
applyTo: "**/*.py"
---

# Python Guidelines

## Code Style

- Follow PEP 8 and PEP 257
- Use Black formatter (line length 88)
- Use type hints for all functions
- Use `dataclasses` or `pydantic` for data structures

## Type Hints

```python
# ✅ Good: Full type hints
def process_user(user_id: str, options: dict[str, Any] | None = None) -> User:
    ...

# ❌ Bad: No type hints
def process_user(user_id, options=None):
    ...
```

## Async/Await

- Use `async def` for I/O-bound operations
- Prefer `asyncio.gather` for concurrent operations
- Use `httpx` or `aiohttp` for async HTTP

## Error Handling

```python
# ✅ Good: Specific exceptions
try:
    result = await fetch_data()
except httpx.HTTPStatusError as e:
    logger.error(f"HTTP error: {e.response.status_code}")
    raise DataFetchError from e

# ❌ Bad: Bare except
try:
    result = await fetch_data()
except:
    pass
```

## FastAPI Patterns

- Use Pydantic models for request/response
- Use dependency injection for shared logic
- Document endpoints with docstrings
- Use HTTPException for error responses

## Imports

```python
# Standard library
import os
from typing import Any

# Third-party
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# Local
from app.core.config import settings
from app.services.user import UserService
```

## Testing

- Use pytest with async fixtures
- Use factories (factory_boy) for test data
- Mock external services with `pytest-mock`
