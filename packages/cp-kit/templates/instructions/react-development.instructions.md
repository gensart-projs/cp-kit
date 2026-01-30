---
name: react-development
description: Component patterns, state management, and accessibility standards for React development.
version: 1.0
applyTo: "**/*.jsx,**/*.tsx,**/*react*"
---

# React Development Guidelines

## Component Patterns
- Functional components with hooks over class components
- Custom hooks for reusable logic
- Compound components for complex UI patterns
- Container/Presentational separation when appropriate

## State Management
- useState for local component state
- useReducer for complex state logic
- Context API for theme/configuration
- External libraries (Zustand, Redux) for app-wide state

## Performance
- React.memo for expensive components
- useMemo for expensive calculations
- useCallback for event handlers
- Lazy loading with React.lazy and Suspense
- Code splitting for large applications

## Hooks Best Practices
- Custom hooks for side effects
- useEffect cleanup functions
- Dependency arrays correctly specified
- Avoid conditional hook calls

## Accessibility
- Semantic HTML elements
- ARIA attributes when needed
- Keyboard navigation support
- Screen reader compatibility
