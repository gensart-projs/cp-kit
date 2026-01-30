# cp-toolkit

> GitHub Copilot Agent Toolkit - Initialize and manage AI agents for your project

## Installation

```bash
# Global install
npm install -g cp-toolkit

# Or use with npx
npx cp-toolkit init
```

## Quick Start

```bash
# Initialize in current directory
cp-toolkit init

# Initialize in new directory
cp-toolkit init my-project

# Skip prompts (use defaults)
cp-toolkit init -y
```

## Commands

### `cp-toolkit init [directory]`

Initialize cp-toolkit with GitHub Copilot 2026 structure:

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

### `cp-toolkit add <type> <name>`

Add new components:

```bash
# Add a new agent
cp-toolkit add agent my-specialist

# Add a new instruction
cp-toolkit add instruction golang
```

### `cp-toolkit list [type]`

List available components:

```bash
cp-toolkit list agents       # List all agents
cp-toolkit list instructions # List all instructions
cp-toolkit list all          # List everything
```

### `cp-toolkit doctor`

Check configuration and diagnose issues:

```bash
cp-toolkit doctor
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
