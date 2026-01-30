<div align="center">

# 🤖 cp-toolkit

**GitHub Copilot Agent Toolkit**

*Initialize and manage AI agents for GitHub Copilot, Claude, Gemini CLI, and other AI assistants.*

[![npm version](https://img.shields.io/npm/v/cp-toolkit.svg)](https://www.npmjs.com/package/cp-toolkit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

[Quick Start](#-quick-start) •
[Project Types](#-project-types) •
[Features](#-features) •
[Commands](#-commands) •
[Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [What is cp-toolkit?](#-what-is-cp-toolkit)
- [Quick Start](#-quick-start)
- [Project Types](#-project-types)
- [Features](#-features)
- [Commands](#-commands)
- [Generated Structure](#-generated-structure)
- [Usage with GitHub Copilot](#-usage-with-github-copilot)
- [Contributing](#-contributing)
- [Roadmap](#️-roadmap)
- [License](#-license)

---

## 🎯 What is cp-toolkit?

**cp-toolkit** is a CLI tool that bootstraps AI agent configurations for your projects. It creates a standardized structure that GitHub Copilot and other AI assistants understand, making them smarter and more context-aware when working with your codebase.

Think of it as **ESLint for AI** — it defines rules, specialists, and behaviors that AI assistants follow when helping you code.

### Why cp-toolkit?

| Feature | Description |
|---------|-------------|
| 🚀 **Instant Setup** | One command to configure 20+ specialized AI agents |
| 🎯 **Context-Aware AI** | Path-specific instructions make AI understand your code better |
| 🔌 **MCP Ready** | Built-in Model Context Protocol support for VS Code |
| 📦 **Zero Lock-in** | Standard markdown files, works with any AI assistant |
| 🛠️ **Extensible** | Add custom agents and instructions for your domain |

---

## 📦 Quick Start

### Installation

```bash
# Install globally
npm install -g cp-toolkit

# Or use with npx (no install needed)
npx cp-toolkit init
```

### Initialize your project

```bash
cd your-project
cp-toolkit init
```

You'll be prompted to select your project type and name. That's it! Your project now has AI-powered agent configurations.

---

## 🏗️ Project Types

When running `cp-toolkit init`, you'll be asked to choose a project type. Each type optimizes the agent configuration for your use case:

### Single App

Standard single application project.

- **Best for:** Websites, web apps, standalone applications
- **Structure:** Agents configured at project root
- **Examples:** Next.js app, React SPA, Express server

### Monorepo

Multi-package repository with shared configurations.

- **Best for:** Turborepo, Nx, Lerna, npm/pnpm workspaces
- **Structure:** Root-level agents + per-package customization possible
- **Examples:** Design system + docs + app, microservices

### Library/Package

Publishable package or library.

- **Best for:** npm packages, SDKs, frameworks, component libraries
- **Focus:** Documentation, testing, API design, compatibility
- **Examples:** UI component library, utility package, SDK

### API Only

Backend-only project without frontend.

- **Best for:** REST APIs, GraphQL servers, microservices
- **Focus:** Backend, database, security, and DevOps agents
- **Examples:** Express API, FastAPI, NestJS backend

---

## ✨ Features

### 🤖 20+ Specialized Agents

Each agent is an expert in a specific domain:

| Agent | Domain | Use Cases |
|-------|--------|-----------|
| `@orchestrator` | Multi-domain coordination | Complex features, architecture decisions |
| `@frontend-specialist` | React, Next.js, CSS | UI components, styling, accessibility |
| `@backend-specialist` | Node.js, Python, APIs | Server logic, endpoints, middleware |
| `@database-architect` | SQL, Prisma, schemas | Data modeling, migrations, optimization |
| `@security-auditor` | OWASP, vulnerabilities | Auth, input validation, security review |
| `@test-engineer` | Jest, Playwright, TDD | Unit tests, E2E tests, coverage |
| `@debugger` | Troubleshooting | Bug fixes, error analysis, debugging |
| `@devops-engineer` | CI/CD, Docker, K8s | Pipelines, containers, deployment |
| `@performance-optimizer` | Core Web Vitals | Speed optimization, profiling |
| `@mobile-developer` | React Native, Flutter | Mobile apps, cross-platform |
| `@documentation-writer` | Technical docs | README, API docs, guides |
| `@code-archaeologist` | Legacy code | Refactoring, understanding old code |
| ... | *and more specialists* | |

### 📋 Path-Specific Instructions

Instructions are automatically applied based on file patterns:

```yaml
# .github/instructions/typescript.instructions.md
---
applyTo: "**/*.ts,**/*.tsx"
---

## TypeScript Guidelines
- Enable strict mode
- No `any` types
- Use discriminated unions
```

### 🔌 MCP Integration

Out-of-the-box Model Context Protocol support for VS Code:

```json
// .vscode/mcp.json (auto-generated)
{
  "servers": {
    "filesystem": { ... },
    "memory": { ... },
    "sequentialThinking": { ... }
  }
}
```

---

## 🛠️ Commands

### `cp-toolkit init [directory]`

Initialize cp-toolkit in a project.

```bash
cp-toolkit init              # Current directory (interactive)
cp-toolkit init my-project   # New directory
cp-toolkit init -y           # Skip prompts, use defaults
cp-toolkit init -f           # Force overwrite existing config
```

**Options:**

| Flag | Description |
|------|-------------|
| `-y, --yes` | Skip all prompts, use default values |
| `-f, --force` | Overwrite existing configuration files |

### `cp-toolkit add <type> <name>`

Add new components to your project.

```bash
cp-toolkit add agent rust-specialist     # Add custom agent
cp-toolkit add instruction golang        # Add language instruction
```

**Types:**

- `agent` - Create a new specialized agent
- `instruction` - Create path-specific instructions

### `cp-toolkit list [type]`

List available components.

```bash
cp-toolkit list              # List everything
cp-toolkit list agents       # List all agents
cp-toolkit list instructions # List all instructions
```

### `cp-toolkit doctor`

Diagnose your configuration and check for issues.

```bash
cp-toolkit doctor
```

**Example output:**

```
✓ .github/ directory exists
✓ copilot-instructions.md exists
✓ 20 agents found
✓ 5 instructions found
✓ AGENTS.md exists at root
✓ .vscode/mcp.json exists
✨ cp-toolkit is healthy!
```

---

## 📂 Generated Structure

After running `cp-toolkit init`, your project will have:

```
your-project/
├── .github/
│   ├── copilot-instructions.md    # Global AI instructions (always active)
│   ├── agents/                    # Agent definitions
│   │   ├── orchestrator.md
│   │   ├── frontend-specialist.md
│   │   ├── backend-specialist.md
│   │   ├── database-architect.md
│   │   ├── security-auditor.md
│   │   └── ... (20+ agents)
│   └── instructions/              # Path-specific rules
│       ├── typescript.instructions.md
│       ├── python.instructions.md
│       ├── database.instructions.md
│       └── security.instructions.md
├── .vscode/
│   └── mcp.json                   # MCP server configuration
└── AGENTS.md                      # Universal AI instructions
```

---

## 🎮 Usage with GitHub Copilot

After initialization, invoke agents in GitHub Copilot Chat using `@agent-name`:

```
@frontend-specialist Create a responsive navbar with dark mode toggle

@security-auditor Review this authentication middleware for vulnerabilities

@orchestrator Implement a user dashboard with profile settings and activity feed

@database-architect Design a schema for a multi-tenant SaaS application

@test-engineer Write comprehensive tests for the UserService class
```

### Tips

- Use `@orchestrator` for complex, multi-domain tasks
- Combine agents: ask `@security-auditor` to review code written by `@backend-specialist`
- Path-specific instructions activate automatically based on the file you're editing

---

## 🤝 Contributing

We'd love your help making cp-toolkit better!

### 🐛 Report Bugs

Found a bug? [Open an issue](https://github.com/gensart-projs/cp-kit/issues/new) with:

- Your OS and Node.js version
- Steps to reproduce
- Expected vs actual behavior

### 💡 Suggest Features

Have an idea? [Start a discussion](https://github.com/gensart-projs/cp-kit/discussions) or open an issue.

### 🔧 Submit PRs

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### 🤖 Add New Agents

Create specialized agents for new domains:

```bash
cp-toolkit add agent rust-specialist
# Then edit .github/agents/rust-specialist.md
```

Share your agents by submitting a PR!

### 🌍 Add Language Instructions

Help developers with new language support:

```bash
cp-toolkit add instruction golang
cp-toolkit add instruction kotlin
cp-toolkit add instruction swift
```

---

## 🗺️ Roadmap

- [ ] `cp-toolkit sync` — Sync with remote agent repositories
- [ ] `cp-toolkit upgrade` — Update agents to latest versions
- [ ] Plugin system for custom MCP servers
- [ ] VS Code extension for visual management
- [ ] AI-powered agent suggestions based on codebase analysis
- [ ] Team sharing via private registries

---

## 📜 License

MIT © 2026 [gensart-projs](https://github.com/gensart-projs)

---

<div align="center">

**⭐ Star us on GitHub if cp-toolkit helps you!**

Made with ❤️ for the AI-assisted development community

[Report Bug](https://github.com/gensart-projs/cp-kit/issues) · [Request Feature](https://github.com/gensart-projs/cp-kit/issues) · [Discussions](https://github.com/gensart-projs/cp-kit/discussions)

</div>
