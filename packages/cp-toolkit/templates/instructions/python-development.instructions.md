---
name: python-development
description: Best practices for Python development including type hints, async/await, and testing.
version: 1.0
applyTo: "**/*.py"
---

# Python Development Guidelines

## Type Hints & Annotations
- Use type hints for all function signatures
- Use `from __future__ import annotations` for forward refs
- Prefer `typing.Optional` over `X | None` for Python 3.9 compat
- Generic types with `TypeVar` when needed

## Code Patterns
- Use dataclasses or Pydantic for data structures
- Async/await for I/O bound operations
- Context managers (`with` statements) for resource management
- List/dict comprehensions for transformations
- Generator functions for large datasets

## Best Practices
- Follow PEP 8 style guidelines
- Use Black for code formatting
- Google/NumPy style docstrings
- Meaningful variable names
- Single responsibility principle

## Error Handling
- Custom exception classes
- Specific exception types over generic Exception
- Proper exception chaining
- Logging with appropriate levels

## Testing
- pytest framework preferred
- Unit tests for functions/classes
- Integration tests for workflows
- Mock external dependencies
