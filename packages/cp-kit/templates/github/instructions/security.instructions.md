---
applyTo: "**/auth/**,**/security/**,**/middleware/auth*"
---

# Security Guidelines

## Authentication

- Use secure, HTTP-only cookies for session tokens
- Implement token refresh with short-lived access tokens
- Use bcrypt or Argon2 for password hashing
- Enforce strong password policies

## Authorization

```typescript
// ✅ Good: Check permissions explicitly
if (!user.permissions.includes('admin:write')) {
  throw new ForbiddenError('Insufficient permissions');
}

// ❌ Bad: Only check authentication
if (!user) throw new UnauthorizedError();
// Missing authorization check!
```

## Input Validation

- Validate all user inputs with Zod or Joi
- Sanitize HTML inputs to prevent XSS
- Use parameterized queries (Prisma handles this)
- Validate file uploads (type, size, content)

## Secrets Management

- Never commit secrets to git
- Use environment variables for secrets
- Rotate secrets regularly
- Use secret managers in production (Vault, AWS Secrets Manager)

## OWASP Top 10

| Vulnerability | Prevention |
|---------------|------------|
| Injection | Parameterized queries, input validation |
| Broken Auth | Secure sessions, MFA, rate limiting |
| XSS | Content Security Policy, sanitization |
| CSRF | CSRF tokens, SameSite cookies |
| Security Misconfiguration | Security headers, disable debug in prod |

## Headers

```typescript
// Required security headers
res.setHeader('X-Content-Type-Options', 'nosniff');
res.setHeader('X-Frame-Options', 'DENY');
res.setHeader('X-XSS-Protection', '1; mode=block');
res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
res.setHeader('Content-Security-Policy', "default-src 'self'");
```

## Rate Limiting

- Implement rate limiting on all public endpoints
- Use exponential backoff for repeated failures
- Log and alert on suspicious patterns

## Audit Logging

- Log all authentication events
- Log all authorization failures
- Log sensitive data access
- Include user ID, IP, timestamp, action
