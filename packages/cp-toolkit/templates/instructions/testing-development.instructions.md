---
name: testing-development
description: Guidelines for test structure, frameworks, and code coverage best practices.
version: 1.0
applyTo: "**/*.test.*,**/*.spec.*,**/tests/**,**/__tests__/**"
---

# Testing Development Guidelines

## Test Structure
- Unit tests for individual functions/classes
- Integration tests for component interactions
- End-to-end tests for user workflows
- Performance tests for critical paths
- Accessibility tests for UI components

## Testing Frameworks
- Jest for JavaScript/TypeScript
- pytest for Python
- RSpec for Ruby
- JUnit for Java
- Appropriate framework per language

## Test Patterns
- Arrange-Act-Assert (AAA) pattern
- Descriptive test names (not test1, test2)
- One assertion per test when possible
- Mock external dependencies
- Test edge cases and error conditions

## Code Coverage
- Aim for 80%+ coverage on critical code
- Focus on business logic over getters/setters
- Integration tests for coverage gaps
- Coverage reports in CI/CD pipeline

## Best Practices
- Tests run independently (no shared state)
- Fast execution for developer experience
- CI/CD integration with quality gates
- Test data management and cleanup
- Documentation of test scenarios
