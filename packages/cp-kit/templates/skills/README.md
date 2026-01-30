# Skills Directory

> Modular knowledge domains for the Antigravity Agent Toolkit

## Structure

```
skills/
├── core/           # Core skills (always recommended)
│   ├── behavioral-modes/    # AI operational modes
│   ├── brainstorming/       # Socratic discovery protocol
│   ├── clean-code/          # Universal coding standards
│   ├── intelligent-routing/ # Auto agent selection
│   ├── mcp-builder/         # Model Context Protocol patterns
│   ├── parallel-agents/     # Multi-agent orchestration
│   └── plan-writing/        # Task planning methodology
│
├── optional/       # Domain-specific skills (load on demand)
│   ├── api-patterns/        # REST, GraphQL patterns
│   ├── app-builder/         # Full-stack scaffolding
│   ├── architecture/        # System design
│   ├── bash-linux/          # Linux shell commands
│   ├── code-review-checklist/
│   ├── database-design/     # Schema, SQL
│   ├── deployment-procedures/
│   ├── documentation-templates/
│   ├── frontend-design/     # UI/UX patterns
│   ├── game-development/
│   ├── geo-fundamentals/    # GenAI optimization
│   ├── i18n-localization/
│   ├── lint-and-validate/
│   ├── mobile-design/
│   ├── nextjs-react-expert/
│   ├── nodejs-best-practices/
│   ├── performance-profiling/
│   ├── powershell-windows/
│   ├── python-patterns/
│   ├── red-team-tactics/
│   ├── seo-fundamentals/
│   ├── server-management/
│   ├── systematic-debugging/
│   ├── tailwind-patterns/
│   ├── tdd-workflow/
│   ├── testing-patterns/
│   ├── vulnerability-scanner/
│   ├── web-design-guidelines/
│   └── webapp-testing/
│
└── doc.md          # This file
```

## Skill Loading Protocol

```
User Request → Match Skill Description → Load SKILL.md
                                            ↓
                                    Read references/ (if exists)
                                            ↓
                                    Read scripts/ (if exists)
```

## Skill Structure

Each skill follows this structure:

```
skill-name/
├── SKILL.md           # (Required) Metadata & instructions
├── scripts/           # (Optional) Python/Bash scripts
├── references/        # (Optional) Templates, docs
└── assets/            # (Optional) Images, logos
```

## Core vs Optional

### Core Skills (Always Load)
These skills define fundamental AI behavior and should be loaded for every session:

| Skill | Purpose |
|-------|---------|
| `clean-code` | Universal coding standards |
| `behavioral-modes` | AI operational modes (brainstorm, implement, debug) |
| `intelligent-routing` | Automatic agent selection |
| `brainstorming` | Socratic discovery protocol |
| `plan-writing` | Task planning methodology |
| `parallel-agents` | Multi-agent orchestration |
| `mcp-builder` | Model Context Protocol patterns |

### Optional Skills (Load on Demand)
These skills are loaded based on the domain of the user's request:

| Category | Skills |
|----------|--------|
| **Frontend** | nextjs-react-expert, tailwind-patterns, web-design-guidelines, frontend-design |
| **Backend** | api-patterns, nodejs-best-practices, python-patterns |
| **Database** | database-design |
| **Testing** | testing-patterns, webapp-testing, tdd-workflow |
| **Security** | vulnerability-scanner, red-team-tactics |
| **DevOps** | deployment-procedures, server-management |
| **Mobile** | mobile-design |
| **Performance** | performance-profiling |
| **SEO** | seo-fundamentals, geo-fundamentals |
| **Other** | documentation-templates, i18n-localization, game-development |

## Path Resolution

When loading skills, use the full path:

```
.agent/skills/core/{skill-name}/SKILL.md
.agent/skills/optional/{skill-name}/SKILL.md
```

Or use the MCP server's `load_skill` tool which resolves paths automatically.
