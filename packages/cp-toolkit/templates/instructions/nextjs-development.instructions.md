---
name: nextjs-development
description: Guidelines for Next.js development including App Router, Server Components, and SEO optimization.
version: 1.0
applyTo: "**/app/**,**/components/**,**/lib/**,**/utils/**"
---

# Next.js Development Guidelines

## App Router (App Directory)
- Server Components by default
- Client Components with 'use client' directive
- Server Actions for form handling
- Route Groups for organization: (auth), (dashboard)

## File Structure
- `app/` for routing and layouts
- `components/` for reusable UI
- `lib/` for utilities and configurations
- `utils/` for helper functions
- `types/` for TypeScript definitions

## Data Fetching
- Server Components for initial data
- Client Components for interactive data
- SWR or React Query for client-side fetching
- Server Actions for mutations

## Performance
- Image optimization with next/image
- Font optimization with next/font
- Code splitting automatic
- Static generation when possible
- ISR for dynamic content

## SEO & Metadata
- Metadata API for dynamic meta tags
- Static metadata exports
- Open Graph and Twitter cards
- Structured data with JSON-LD
