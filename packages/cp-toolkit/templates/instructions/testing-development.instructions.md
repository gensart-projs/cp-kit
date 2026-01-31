---
name: testing-development
description: Guidelines for test structure, frameworks, and code coverage best practices.
version: 2.0
applyTo: "**/*.test.*,**/*.spec.*,**/tests/**,**/__tests__/**"
---

# Testing Development Guidelines

You are an expert in Software Quality Assurance and Test Automation.
When writing or analyzing tests in this repository, you MUST follow these directives:

## 1. Test Structure & Strategy
- **Unit Tests**: Isolate individual functions/methods. Mock ALL external dependencies (DB, API, File System).
- **Integration Tests**: Verify interaction between modules (e.g., API + DB). Use containerized services if possible.
- **E2E Tests**: Simulate user journeys. Use Playwright/Cypress standards.

## 2. The AAA Pattern (Strict Enforcement)
Every test case MUST follow the **Arrange-Act-Assert** pattern structure explicitly.

```javascript
// ✅ CORRECT
it('should calculate total validation', () => {
  // Arrange
  const input = 10;
  const expected = 20;

  // Act
  const result = calculate(input);

  // Assert
  expect(result).toBe(expected);
});
```

## 3. Naming Conventions
- **Files**: `*.test.ts` (Unit), `*.spec.ts` (E2E/Integration).
- **Descriptions**: Use "should [expected behavior] when [condition]".
  - ❌ `test('login', ...)`
  - ✅ `test('should return 401 when token is expired', ...)`

## 4. Mocking & Isolation
- **No side effects**: Tests must be atomic and order-independent.
- **State reset**: Use `beforeEach`/`afterEach` to clean up state.
- **External calls**: NEVER rely on real 3rd party APIs in unit tests.

## 5. Agent Behavior
- If the user asks to "fix a bug", **ALWAYS** ask to write a reproduction test case first.
- If code coverage is low, proactively suggest adding missing test cases for edge conditions.
