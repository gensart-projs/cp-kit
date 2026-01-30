---
applyTo: "**/*.py"
---

# Python Guidelines

## Type Hints
- Use type hints for all function signatures
- Use `from __future__ import annotations` for forward refs
- Prefer `typing.Optional` over `X | None` for Python 3.9 compat

## Patterns
- Use dataclasses or Pydantic for data structures
- Async/await for I/O bound operations
- Context managers for resource management

## Style
- Follow PEP 8
- Use Black for formatting
- Docstrings in Google style
