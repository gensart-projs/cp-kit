<div align="center">

# 🤖 cp-kit

**GitHub Copilot Agent Toolkit**

*Initialize and manage AI agents for GitHub Copilot, Claude, Gemini CLI, and other AI assistants.*

[![npm version](https://img.shields.io/npm/v/cp-kit.svg)](https://www.npmjs.com/package/cp-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

[Getting Started](#-quick-start) •
[Features](#-features) •
[Commands](#-commands) •
[Contributing](#-contributing)

</div>

---

## 🎯 What is cp-kit?

**cp-kit** is a CLI tool that bootstraps AI agent configurations for your projects. It creates a standardized structure that GitHub Copilot and other AI assistants understand, making them smarter and more context-aware when working with your codebase.

Think of it as **ESLint for AI** — it defines rules, specialists, and behaviors that AI assistants follow when helping you code.

### Why cp-kit?

- 🚀 **Instant Setup** — One command to configure 20+ specialized AI agents
- 🎯 **Context-Aware AI** — Path-specific instructions make AI understand your code better
- 🔌 **MCP Ready** — Built-in Model Context Protocol support for VS Code
- 📦 **Zero Lock-in** — Standard markdown files, works with any AI assistant
- 🛠️ **Extensible** — Add custom agents and instructions for your domain

---

## 📦 Quick Start

`ash
# Install globally
npm install -g cp-kit

# Initialize in your project
cd your-project
cp-kit init

# Or use with npx (no install needed)
npx cp-kit init
`

That's it! Your project now has AI-powered agent configurations.

---

## ✨ Features

### 🤖 20 Specialized Agents

Each agent is an expert in a specific domain:

| Agent | Domain | Triggers |
|-------|--------|----------|
| `@orchestrator` | Multi-domain coordination | complex, architecture |
| `@frontend-specialist` | React, Next.js, CSS | ui, component, styling |
| `@backend-specialist` | Node.js, Python, APIs | api, server, endpoint |
| `@database-architect` | SQL, Prisma, schemas | database, migration |
| `@security-auditor` | OWASP, vulnerabilities | security, auth |
| `@test-engineer` | Jest, Playwright, TDD | test, coverage |
| `@debugger` | Troubleshooting | bug, error, fix |
| `@devops-engineer` | CI/CD, Docker, K8s | deploy, pipeline |
| `@performance-optimizer` | Core Web Vitals | speed, optimize |
| `@mobile-developer` | React Native, Flutter | mobile, ios, android |
| ... | *and 10 more specialists* | |

### 📋 Path-Specific Instructions

Instructions are automatically applied based on file patterns:

`yaml
# .github/instructions/typescript.instructions.md
---
applyTo: "**/*.ts,**/*.tsx"
---

## TypeScript Guidelines
- Enable strict mode
- No `any` types
- Use discriminated unions
`

### 🔌 MCP Integration

Out-of-the-box Model Context Protocol support for VS Code:

`json
// .vscode/mcp.json (auto-generated)
{
  "servers": {
    "filesystem": { ... },
    "memory": { ... },
    "sequentialThinking": { ... }
  }
}
`

---

## 🛠️ Commands

### `cp-kit init [directory]`

Initialize cp-kit in a project:

`ash
cp-kit init              # Current directory
cp-kit init my-project   # New directory
cp-kit init -y           # Skip prompts, use defaults
cp-kit init -f           # Force overwrite existing
`

### `cp-kit add <type> <name>`

Add new components:

`ash
cp-kit add agent my-specialist      # Add custom agent
cp-kit add instruction golang       # Add language instruction
`

### `cp-kit list [type]`

List available components:

`ash
cp-kit list agents        # List all agents
cp-kit list instructions  # List all instructions
cp-kit list all           # List everything
`

### `cp-kit doctor`

Diagnose configuration:

`ash
cp-kit doctor
# ✓ .github/ directory exists
# ✓ copilot-instructions.md exists
# ✓ 20 agents found
# ✓ 5 instructions found
# ✓ AGENTS.md exists at root
# ✓ .vscode/mcp.json exists
# ✨ cp-kit is healthy!
`

---

## 📂 Generated Structure

`
your-project/
├── .github/
│   ├── copilot-instructions.md    # Global AI instructions
│   ├── agents/                    # Agent definitions
│   │   ├── orchestrator.md
│   │   ├── frontend-specialist.md
│   │   ├── backend-specialist.md
│   │   └── ... (20 agents)
│   └── instructions/              # Path-specific rules
│       ├── typescript.instructions.md
│       ├── python.instructions.md
│       ├── react.instructions.md
│       ├── database.instructions.md
│       └── security.instructions.md
├── .vscode/
│   └── mcp.json                   # MCP server configuration
└── AGENTS.md                      # Universal AI instructions
`

---

## 🎮 Usage with GitHub Copilot

After initialization, invoke agents in Copilot Chat:

`
@frontend-specialist Create a responsive navbar with dark mode toggle

@security-auditor Review this authentication middleware for vulnerabilities

@orchestrator Implement a user dashboard with profile settings and activity feed

@database-architect Design a schema for a multi-tenant SaaS application
`

---

## 🤝 Contributing

We'd love your help making cp-kit better! Here are some ways to contribute:

### 🐛 Report Bugs

Found a bug? [Open an issue](https://github.com/gensart-projs/cp-kit/issues/new) with:
- Your OS and Node.js version
- Steps to reproduce
- Expected vs actual behavior

### 💡 Suggest Features

Have an idea? We're all ears! [Start a discussion](https://github.com/gensart-projs/cp-kit/discussions) or open an issue.

### 🔧 Submit PRs

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### 📝 Improve Documentation

Documentation improvements are always welcome! Fix typos, add examples, or clarify explanations.

### 🤖 Add New Agents

Create specialized agents for new domains:

`ash
cp-kit add agent rust-specialist
# Then edit .github/agents/rust-specialist.md
`

Share your agents by submitting a PR to add them to the default set!

### 🌍 Add Language Instructions

Help developers in other languages:

`ash
cp-kit add instruction golang
cp-kit add instruction kotlin
cp-kit add instruction swift
`

---

## 🗺️ Roadmap

- [ ] `cp-kit sync` — Sync with remote agent repositories
- [ ] `cp-kit upgrade` — Update agents to latest versions
- [ ] Plugin system for custom MCP servers
- [ ] VS Code extension for visual management
- [ ] AI-powered agent suggestions based on codebase analysis
- [ ] Team sharing via private registries

---

## 📜 License

MIT © 2026 [gensart-projs](https://github.com/gensart-projs)

---

<div align="center">

**⭐ Star us on GitHub if cp-kit helps you!**

Made with ❤️ for the AI-assisted development community

</div>
