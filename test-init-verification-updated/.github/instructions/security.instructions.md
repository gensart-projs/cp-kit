---
applyTo: "**/auth/**,**/security/**,**/*auth*,**/*token*,**/*session*"
---

# Security Guidelines

## Authentication
- JWT with short expiry + refresh tokens
- HttpOnly cookies for web sessions
- Rate limit authentication endpoints

## Authorization
- RBAC or ABAC patterns
- Check permissions server-side always
- Deny by default, allow explicitly

## Data Protection
- Sanitize all user inputs
- Escape outputs by context (HTML, SQL, etc.)
- Never log sensitive data (passwords, tokens, PII)

## OWASP Top 10
- Validate content types
- CSRF tokens for state-changing operations
- Security headers (CSP, HSTS, X-Frame-Options)
