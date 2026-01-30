---
name: api-development
description: RESTful API design standards including versioning, error handling, and documentation.
version: 1.0
applyTo: "**/api/**,**/routes/**,**/controllers/**,**/services/**,**/*api*,**/*endpoint*"
---

# API Development Guidelines

## RESTful Design
- Proper HTTP methods (GET, POST, PUT, DELETE)
- Resource-based URLs (/users, /users/{id})
- Status codes: 200, 201, 400, 401, 403, 404, 500
- Content-Type and Accept headers
- Idempotent operations where appropriate

## API Versioning
- URL versioning: /api/v1/users
- Header versioning when needed
- Backward compatibility maintenance
- Deprecation notices for breaking changes
- Version documentation

## Request/Response
- JSON as primary format
- Consistent response structure
- Pagination for list endpoints
- Filtering and sorting parameters
- Rate limiting headers

## Error Handling
- Consistent error response format
- Appropriate HTTP status codes
- User-friendly error messages
- Error logging and monitoring
- Graceful degradation

## Documentation
- OpenAPI/Swagger specifications
- Interactive API documentation
- Authentication examples
- Rate limiting information
- Changelog for API versions
