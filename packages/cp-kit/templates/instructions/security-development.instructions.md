---
name: security-development
description: Comprehensive security guidelines including auth, data protection, and web security.
version: 1.0
applyTo: "**/auth/**,**/security/**,**/*auth*,**/*token*,**/*session*,**/middleware/**"
---

# Security Development Guidelines

## Authentication & Authorization
- JWT with short expiry + refresh tokens
- HttpOnly cookies for web sessions
- Rate limiting on authentication endpoints
- RBAC or ABAC patterns implemented
- Server-side permission checks always

## Data Protection
- Input sanitization and validation
- Output encoding by context (HTML, SQL, JSON)
- Never log sensitive data (passwords, tokens, PII)
- Encryption at rest and in transit
- Secure password hashing (bcrypt, Argon2)

## Web Security
- CSRF tokens for state-changing operations
- Content Security Policy (CSP) headers
- HTTPS enforcement (HSTS)
- Secure headers (X-Frame-Options, etc.)
- XSS prevention with proper escaping

## API Security
- API versioning for breaking changes
- Request/response validation schemas
- CORS configuration for allowed origins
- API rate limiting and throttling
- Proper error messages (no sensitive info)

## OWASP Top 10
- Injection prevention (parameterized queries)
- Broken authentication handling
- Sensitive data exposure protection
- XML external entity prevention
- Access control enforcement
