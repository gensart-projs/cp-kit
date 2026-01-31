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
| `.github/cp-kit-models.yaml` | AI model allocation matrix |

## Architect-Builder Strategy

cp-toolkit implements the **Architect-Builder Pattern** for optimal AI agent performance. This strategy separates reasoning from execution:

### Dual-Mode Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  SINGLE MODE                    HYBRID MODE (Architect-Builder) │
│  ─────────────                  ───────────────────────────────  │
│                                                                  │
│  ┌─────────────────┐            PLANNER         EXECUTOR         │
│  │ High-IQ Model   │            (Architect)     (Builder)        │
│  │ Pure Reasoning  │            ┌──────────┐    ┌──────────┐     │
│  └─────────────────┘            │ temp 0.1 │ →  │ temp 0.3 │     │
│                                 │ Strategy │    │ Code Gen │     │
│  • orchestrator                 └──────────┘    └──────────┘     │
│  • security-auditor                                              │
│  • debugger                     • backend-specialist             │
│  • documentation-writer         • frontend-specialist            │
│                                 • devops-engineer                │
└─────────────────────────────────────────────────────────────────┘
```

### Mode Selection

| Mode | Temperature | Use Case |
|------|-------------|----------|
| **Single** | 0.1 | Pure reasoning tasks (analysis, planning, auditing) |
| **Hybrid Planner** | 0.1 | Strategic thinking, architecture decisions |
| **Hybrid Executor** | 0.3 | Code generation, implementation |

### Agent Categories

1. **Leadership & Strategy** (Single Mode)
   - `orchestrator`, `product-manager`, `product-owner`, `project-planner`
   
2. **Development Core** (Hybrid Mode)
   - `backend-specialist`, `frontend-specialist`, `mobile-developer`, `game-developer`

3. **Infrastructure & Ops** (Hybrid Mode)
   - `devops-engineer`, `database-architect`, `security-auditor`, `penetration-tester`

4. **Quality & Optimization** (Hybrid Mode)
   - `qa-automation-engineer`, `test-engineer`, `performance-optimizer`, `debugger`

5. **Specialists & Research** (Mixed)
   - `code-archaeologist`, `documentation-writer`, `seo-specialist`, `explorer-agent`

### Why This Works

- **Planner (Architect)**: Uses high-reasoning models with low temperature for accurate strategic decisions
- **Executor (Builder)**: Uses fast code-generation models with slightly higher temperature for creative implementation
- **Cost Optimization**: Expensive models only for planning; economical models for bulk code generation
- **Quality Assurance**: Clear separation prevents "hallucination drift" in long implementations

### Models Configuration

The `cp-kit-models.yaml` file defines the model allocation:

```yaml
agents:
  backend-specialist:
    mode: "hybrid"
    planner:
      model: "gpt-5.2"
      task: "API architecture, security and data modeling"
    executor:
      model: "gpt-5.2-codex"
      task: "Route and service implementation with perfect typing"
```

## License

MIT
