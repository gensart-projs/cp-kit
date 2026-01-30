---
applyTo: "**/*.ts,**/*.tsx"
---

# TypeScript Guidelines

## Code Style

- Use strict mode (`"strict": true` in tsconfig)
- Prefer `interface` over `type` for object shapes
- Use `const` assertions for literal types
- Avoid `any` - use `unknown` if type is truly unknown
- Use discriminated unions for complex state

## React Components (TSX)

- Use functional components with TypeScript
- Define props as interfaces, not inline types
- Use `React.FC` sparingly - prefer explicit return types
- Extract complex logic to custom hooks

## Patterns

```typescript
// ✅ Good: Interface with explicit props
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function Button({ label, onClick, disabled }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled}>{label}</button>;
}

// ❌ Bad: Inline types, any
export const Button = (props: { label: any }) => <button>{props.label}</button>;
```

## Error Handling

- Use Result types or discriminated unions for error states
- Throw only for truly exceptional cases
- Type guard with `is` predicates

## Imports

- Use absolute imports with path aliases (`@/components`, `@/lib`)
- Group imports: external → internal → relative
- Avoid barrel files in large projects
