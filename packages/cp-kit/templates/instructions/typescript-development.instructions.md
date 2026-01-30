---
name: typescript-development
description: Strict guidelines for TypeScript development including type safety, modules, and error handling.
version: 1.0
applyTo: "**/*.ts,**/*.tsx,**/*.mts,**/*.cts"
---

# TypeScript Development Guidelines

## Strict Mode & Type Safety
- Enable `strict: true` in tsconfig.json
- No `any` types - use `unknown` and narrow with type guards
- Explicit return types for public functions
- Use `strictNullChecks` and `noImplicitAny`

## Code Patterns
- Prefer `interface` over `type` for object shapes
- Use `as const` for literal types and enums
- Leverage discriminated unions for state management
- Use mapped types for transformations
- Prefer `readonly` for immutable data

## Imports & Modules
- Use type-only imports: `import type { X } from 'y'`
- Barrel exports for public APIs only
- Avoid relative imports with `../` - use absolute paths

## Error Handling
- Use custom error classes extending `Error`
- Prefer Result types over throwing exceptions
- Use try/catch only for external operations
