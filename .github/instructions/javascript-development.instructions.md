---
name: javascript-development
description: Best practices for modern JavaScript development including ES6+ features and functional patterns.
version: 1.0
applyTo: "**/*.js,**/*.mjs,**/*.cjs"
---

# JavaScript Development Guidelines

## ES6+ Features
- Use `const` and `let` instead of `var`
- Arrow functions for callbacks and anonymous functions
- Template literals over string concatenation
- Destructuring for objects and arrays
- Spread/rest operators for manipulation

## Code Patterns
- Prefer functional programming approaches
- Use async/await over Promises for readability
- Implement proper error handling with try/catch
- Use Map/Set for collections when appropriate
- Leverage object destructuring for configuration

## Best Practices
- Strict mode: `'use strict'` at file/module level
- Consistent naming: camelCase for variables/functions
- Meaningful variable names over abbreviations
- Single responsibility principle for functions

## Performance
- Avoid global variables
- Use efficient algorithms and data structures
- Minimize DOM manipulation
- Cache expensive operations
