# GitHub Copilot Instructions

> **Copilot Kit v2** - Project: test-init-verification-updated

## 🤖 Agent System

This project uses specialized AI agents located in `.github/agents/`.

### Available Agents

| Agent | Specialty |
|-------|-----------|
| orchestrator | Multi-agent coordination, complex tasks |
| frontend-specialist | React, Next.js, CSS, accessibility |
| backend-specialist | Node.js, Python, APIs, microservices |
| database-architect | Schema design, SQL, Prisma, migrations |
| security-auditor | OWASP, auth, vulnerability analysis |
| test-engineer | Testing strategies, coverage, TDD |
| debugger | Troubleshooting, root cause analysis |
| devops-engineer | CI/CD, Docker, Kubernetes, infrastructure |
| performance-optimizer | Web vitals, profiling, optimization |
| documentation-writer | Technical docs, API documentation |

### How to Use Agents

To invoke an agent, reference it in your prompt:
- "Use the **orchestrator** to plan this feature"
- "Ask the **security-auditor** to review this code"
- "Have the **debugger** analyze this error"

## 📋 Language Instructions

Context-specific rules are in `.github/instructions/`:
- `typescript.instructions.md` - TS/TSX files
- `python.instructions.md` - Python files
- `security.instructions.md` - Auth/security code
- `database.instructions.md` - Database/Prisma code

## 🔧 MCP Servers

Configured in `.vscode/mcp.json`:
- **filesystem** - File system access
- **memory** - Persistent memory across sessions

## 🚀 Workflows

Workflow templates in `.github/copilot-workflows/`:
- `/create` - Scaffold new features
- `/debug` - Systematic debugging
- `/test` - Generate test suites
- `/plan` - Architecture planning

## 📝 General Guidelines

1. **Read before writing** - Understand existing patterns
2. **Small, focused changes** - One concern per commit
3. **Test coverage** - Write tests for new features
4. **Security first** - Validate inputs, sanitize outputs
