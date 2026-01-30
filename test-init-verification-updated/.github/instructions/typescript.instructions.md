---
applyTo: "**/*.ts,**/*.tsx,**/*.mts,**/*.cts"
---

# TypeScript Guidelines

## Strict Mode
- Enable `strict: true` in tsconfig.json
- No `any` types - use `unknown` and narrow with type guards
- Explicit return types for public functions

## Patterns
- Prefer `interface` over `type` for object shapes
- Use `as const` for literal types
- Leverage discriminated unions for state

## Imports
- Use type-only imports: `import type { X } from 'y'`
- Barrel exports for public APIs only
