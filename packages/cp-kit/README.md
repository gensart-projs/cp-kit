# cp-kit

> GitHub Copilot Agent Toolkit - Initialize and manage AI agents for your project

## Installation

```bash
# Global install
npm install -g @brainlifyai/cp-kit

# Or use with npx
npx @brainlifyai/cp-kit init
```

## Quick Start

```bash
# Initialize in current directory
cp-kit init

# Initialize in new directory
cp-kit init my-project

# Skip prompts (use defaults)
cp-kit init -y
```

## Commands

### `cp-kit init [directory]`

Initialize cp-kit with GitHub Copilot 2026 structure:

```
.github/
├── copilot-instructions.md    # Global instructions (always active)
├── agents/                    # Agent definitions
│   ├── orchestrator.md
│   ├── frontend-specialist.md
│   └── backend-specialist.md
└── instructions/              # Path-specific rules
    ├── typescript.instructions.md
    ├── python.instructions.md
    └── security.instructions.md

AGENTS.md                      # Universal AI instructions
.vscode/mcp.json              # MCP server configuration
```

Options:
- `-y, --yes` - Skip prompts, use defaults
- `-f, --force` - Overwrite existing configuration

### `cp-kit add <type> <name>`

Add new components:

```bash
# Add a new agent
cp-kit add agent my-specialist

# Add a new instruction
cp-kit add instruction golang
```

### `cp-kit list [type]`

List available components:

```bash
cp-kit list agents       # List all agents
cp-kit list instructions # List all instructions
cp-kit list all          # List everything
```

### `cp-kit doctor`

Check configuration and diagnose issues:

```bash
cp-kit doctor
```

## GitHub Copilot Integration

After initialization, GitHub Copilot automatically loads:

1. **copilot-instructions.md** - Always active, global rules
2. **agents/*.md** - Invokable with `@agent-name`
3. **instructions/*.instructions.md** - Applied based on `applyTo` patterns

### Using Agents

In GitHub Copilot Chat:

```
@frontend-specialist Create a responsive navbar component
@security-auditor Review this authentication flow
@orchestrator Implement user dashboard with API
```

### Path-Specific Instructions

Instructions are applied automatically based on file patterns:

```yaml
# typescript.instructions.md
---
applyTo: "**/*.ts,**/*.tsx"
---

## TypeScript Guidelines
- Enable strict mode
- No any types
...
```

## Structure

| File | Purpose |
|------|---------|
| `.github/copilot-instructions.md` | Global instructions (always active) |
| `.github/agents/*.md` | Agent definitions |
| `.github/instructions/*.instructions.md` | Path-specific rules |
| `AGENTS.md` | Universal AI instructions |
| `.vscode/mcp.json` | MCP server configuration |

## License

MIT
