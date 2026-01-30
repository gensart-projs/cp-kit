/**
 * cp-kit init command
 * 
 * Initializes Copilot Kit with GitHub Copilot 2026 standard structure.
 * Primary structure: .github/ (GitHub Copilot native)
 */

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';

// Template definitions - All 20 agents
const TEMPLATE_AGENTS = [
  {
    name: 'orchestrator',
    description: 'Multi-domain task coordinator',
    skills: ['intelligent-routing', 'parallel-agents', 'plan-writing'],
    triggers: ['complex', 'multi-file', 'architecture', 'coordinate']
  },
  {
    name: 'frontend-specialist',
    description: 'React, Next.js, CSS expert',
    skills: ['nextjs-react', 'accessibility', 'tailwind'],
    triggers: ['ui', 'component', 'react', 'css', 'frontend', 'styling']
  },
  {
    name: 'backend-specialist',
    description: 'Node.js, Python, APIs expert',
    skills: ['api-patterns', 'error-handling', 'caching'],
    triggers: ['api', 'server', 'backend', 'endpoint', 'node', 'express']
  },
  {
    name: 'database-architect',
    description: 'Schema design, SQL, Prisma expert',
    skills: ['prisma', 'query-optimization', 'migrations'],
    triggers: ['database', 'schema', 'sql', 'prisma', 'migration', 'query']
  },
  {
    name: 'security-auditor',
    description: 'Security analysis, OWASP expert',
    skills: ['vulnerability-scanner', 'auth-patterns'],
    triggers: ['security', 'auth', 'vulnerability', 'owasp', 'audit']
  },
  {
    name: 'test-engineer',
    description: 'Testing strategies, coverage expert',
    skills: ['testing-patterns', 'e2e-testing'],
    triggers: ['test', 'coverage', 'jest', 'playwright', 'vitest']
  },
  {
    name: 'debugger',
    description: 'Troubleshooting, root cause analysis',
    skills: ['debugging-strategies', 'performance-profiling'],
    triggers: ['bug', 'error', 'fix', 'debug', 'why', 'crash']
  },
  {
    name: 'devops-engineer',
    description: 'CI/CD, Docker, infrastructure expert',
    skills: ['docker-patterns', 'ci-cd-pipelines'],
    triggers: ['deploy', 'docker', 'ci', 'pipeline', 'kubernetes', 'infra']
  },
  {
    name: 'project-planner',
    description: 'Architecture decisions, task planning',
    skills: ['plan-writing', 'brainstorming'],
    triggers: ['plan', 'architecture', 'design', 'roadmap', 'breakdown']
  },
  {
    name: 'performance-optimizer',
    description: 'Web performance, Core Web Vitals expert',
    skills: ['performance-profiling', 'bundle-optimization'],
    triggers: ['performance', 'speed', 'optimize', 'lighthouse', 'bundle']
  },
  {
    name: 'mobile-developer',
    description: 'React Native, Flutter, iOS, Android expert',
    skills: ['mobile-patterns', 'cross-platform'],
    triggers: ['mobile', 'ios', 'android', 'react-native', 'flutter', 'app']
  },
  {
    name: 'documentation-writer',
    description: 'Technical docs, API documentation expert',
    skills: ['technical-writing', 'api-docs'],
    triggers: ['docs', 'documentation', 'readme', 'api-docs', 'jsdoc']
  },
  {
    name: 'seo-specialist',
    description: 'SEO optimization, meta tags expert',
    skills: ['seo-patterns', 'structured-data'],
    triggers: ['seo', 'meta', 'search', 'ranking', 'sitemap']
  },
  {
    name: 'code-archaeologist',
    description: 'Legacy code analysis, refactoring expert',
    skills: ['refactoring', 'code-analysis'],
    triggers: ['legacy', 'refactor', 'understand', 'cleanup', 'technical-debt']
  },
  {
    name: 'explorer-agent',
    description: 'Codebase exploration and analysis',
    skills: ['code-navigation', 'pattern-recognition'],
    triggers: ['explore', 'find', 'search', 'where', 'locate']
  },
  {
    name: 'game-developer',
    description: 'Game logic, mechanics, interactive experiences',
    skills: ['game-patterns', 'physics', 'graphics'],
    triggers: ['game', 'physics', 'animation', 'canvas', 'webgl']
  },
  {
    name: 'penetration-tester',
    description: 'Offensive security, vulnerability exploitation',
    skills: ['pentesting', 'exploitation'],
    triggers: ['pentest', 'exploit', 'hack', 'red-team', 'attack']
  },
  {
    name: 'product-owner',
    description: 'Product strategy, backlog management',
    skills: ['product-management', 'prioritization'],
    triggers: ['backlog', 'priority', 'mvp', 'feature', 'user-story']
  },
  {
    name: 'product-manager',
    description: 'Requirements gathering, user research',
    skills: ['requirements', 'user-research'],
    triggers: ['requirements', 'spec', 'user', 'stakeholder', 'prd']
  },
  {
    name: 'qa-automation-engineer',
    description: 'E2E testing, CI pipelines, quality automation',
    skills: ['automation', 'ci-testing'],
    triggers: ['qa', 'automation', 'e2e', 'regression', 'quality']
  }
];

const TEMPLATE_INSTRUCTIONS = {
  typescript: {
    applyTo: '**/*.ts,**/*.tsx,**/*.mts,**/*.cts',
    content: `## TypeScript Guidelines

### Strict Mode
- Enable \`strict: true\` in tsconfig.json
- No \`any\` types - use \`unknown\` and narrow
- Explicit return types for public functions

### Patterns
- Prefer \`interface\` over \`type\` for objects
- Use \`as const\` for literal types
- Leverage discriminated unions for state

### Imports
- Use path aliases (@/components, @/lib)
- Barrel exports for public APIs only
- Tree-shakeable imports

### Error Handling
- Use Result<T, E> pattern for expected errors
- Throw only for unexpected errors
- Custom error classes extend Error`
  },
  python: {
    applyTo: '**/*.py',
    content: `## Python Guidelines

### Style
- Black formatter, line length 88
- Type hints for all public functions
- PEP 8 naming conventions

### Patterns
- Pydantic for data validation
- FastAPI for APIs
- Async/await for I/O operations

### Imports
- isort for import ordering
- Absolute imports preferred
- TYPE_CHECKING for type-only imports

### Error Handling
- Custom exceptions inherit from base
- Use \`raise from\` for chained exceptions
- Context managers for resources`
  },
  react: {
    applyTo: '**/*.jsx,**/*.tsx,**/components/**',
    content: `## React Guidelines

### Components
- Functional components only
- Custom hooks for shared logic
- Props interface above component

### State
- useState for local state
- useReducer for complex state
- Context for global, Zustand for app state

### Performance
- React.memo for expensive renders
- useMemo/useCallback judiciously
- Lazy load routes and heavy components

### Testing
- React Testing Library
- Test behavior, not implementation
- Mock at network boundary`
  },
  database: {
    applyTo: '**/prisma/**,**/*.sql,**/migrations/**,**/schema.*',
    content: `## Database Guidelines

### Schema Design
- UUID for primary keys
- Timestamps: createdAt, updatedAt
- Soft delete with deletedAt

### Prisma
- Use transactions for multi-table ops
- Select only needed fields
- Paginate with cursor, not offset

### Migrations
- One migration per feature
- Never modify applied migrations
- Test migrations on copy of prod data

### Security
- Parameterized queries only
- Row-level security where needed
- Encrypt PII at rest`
  },
  security: {
    applyTo: '**/auth/**,**/security/**,**/*auth*,**/*token*,**/*session*',
    content: `## Security Guidelines

### Authentication
- JWT with short expiry + refresh tokens
- HttpOnly cookies for web
- Rate limit auth endpoints

### Authorization
- RBAC or ABAC patterns
- Check permissions server-side
- Deny by default

### Data Protection
- Sanitize all inputs
- Escape outputs by context
- Never log sensitive data

### OWASP Top 10
- Validate content types
- CSRF tokens for state changes
- Security headers (CSP, HSTS)`
  }
};

export async function initCommand(directory, options) {
  const targetDir = directory ? path.resolve(directory) : process.cwd();
  const dirName = path.basename(targetDir);
  
  console.log(chalk.bold.cyan('\n🚀 cp-kit - GitHub Copilot Agent Toolkit\n'));
  
  // Create directory if needed
  if (directory && !fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(chalk.green(`📁 Created directory: ${dirName}`));
  }
  
  // Check for existing configuration
  const githubDir = path.join(targetDir, '.github');
  const copilotFile = path.join(githubDir, 'copilot-instructions.md');
  
  if (fs.existsSync(copilotFile) && !options.force) {
    const { overwrite } = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: 'cp-kit already initialized. Overwrite?',
      initial: false
    });
    
    if (!overwrite) {
      console.log(chalk.yellow('⚠️  Aborted. Use --force to overwrite.'));
      return;
    }
  }
  
  // Interactive configuration - defaults include ALL agents and languages
  const ALL_AGENT_NAMES = TEMPLATE_AGENTS.map(a => a.name);
  const ALL_LANGUAGES = ['typescript', 'python', 'react'];
  
  let config = {
    projectName: dirName,
    projectType: 'app',
    languages: ALL_LANGUAGES,
    agents: ALL_AGENT_NAMES,
    includeMcp: true
  };
  
  if (!options.yes) {
    const response = await prompts([
      {
        type: 'text',
        name: 'projectName',
        message: 'Project name:',
        initial: dirName
      },
      {
        type: 'select',
        name: 'projectType',
        message: 'Project type:',
        choices: [
          { title: 'Single App', value: 'app' },
          { title: 'Monorepo', value: 'monorepo' },
          { title: 'Library/Package', value: 'library' },
          { title: 'API Only', value: 'api' }
        ],
        initial: 0
      },
      {
        type: 'multiselect',
        name: 'languages',
        message: 'Languages used:',
        choices: [
          { title: 'TypeScript', value: 'typescript', selected: true },
          { title: 'Python', value: 'python', selected: true },
          { title: 'React/JSX', value: 'react', selected: true }
        ],
        min: 1
      },
      {
        type: 'multiselect',
        name: 'agents',
        message: 'Select agents:',
        choices: TEMPLATE_AGENTS.map(a => ({
          title: `${a.name} - ${a.description}`,
          value: a.name,
          selected: true  // All agents selected by default
        })),
        min: 1
      },
      {
        type: 'confirm',
        name: 'includeMcp',
        message: 'Include MCP server configuration?',
        initial: true
      }
    ]);
    
    if (!response.projectName) {
      console.log(chalk.yellow('Aborted.'));
      return;
    }
    
    config = { ...config, ...response };
  }
  
  // Start installation
  const spinner = ora('Creating cp-kit structure...').start();
  
  try {
    // Create .github structure
    await fs.ensureDir(path.join(githubDir, 'agents'));
    await fs.ensureDir(path.join(githubDir, 'instructions'));
    
    spinner.text = 'Creating copilot-instructions.md...';
    
    // Create main copilot-instructions.md
    await fs.writeFile(copilotFile, generateCopilotInstructions(config));
    
    spinner.text = 'Creating agents...';
    
    // Create agents
    for (const agentName of config.agents) {
      const agent = TEMPLATE_AGENTS.find(a => a.name === agentName);
      if (agent) {
        await fs.writeFile(
          path.join(githubDir, 'agents', `${agent.name}.md`),
          generateAgentFile(agent)
        );
      }
    }
    
    spinner.text = 'Creating instructions...';
    
    // Create instructions based on languages
    const instructionsToCreate = new Set(['security', 'database']);
    config.languages.forEach(lang => {
      instructionsToCreate.add(lang);
      if (lang === 'react') instructionsToCreate.add('typescript');
    });
    
    for (const instrName of instructionsToCreate) {
      const instr = TEMPLATE_INSTRUCTIONS[instrName];
      if (instr) {
        await fs.writeFile(
          path.join(githubDir, 'instructions', `${instrName}.instructions.md`),
          `---\napplyTo: "${instr.applyTo}"\n---\n\n${instr.content}\n`
        );
      }
    }
    
    spinner.text = 'Creating AGENTS.md...';
    
    // Create AGENTS.md at root
    await fs.writeFile(path.join(targetDir, 'AGENTS.md'), generateAgentsMd(config));
    
    // Create MCP configuration if requested
    if (config.includeMcp) {
      spinner.text = 'Setting up MCP...';
      await fs.ensureDir(path.join(targetDir, '.vscode'));
      await fs.writeFile(
        path.join(targetDir, '.vscode', 'mcp.json'),
        JSON.stringify(generateMcpConfig(), null, 2)
      );
    }
    
    spinner.succeed(chalk.green('cp-kit initialized successfully!'));
    
    // Print summary
    console.log('');
    console.log(chalk.bold('📁 Created structure:'));
    console.log(chalk.gray(''));
    console.log(chalk.gray('  .github/'));
    console.log(chalk.gray('  ├── copilot-instructions.md    # Global instructions'));
    console.log(chalk.gray('  ├── agents/'));
    config.agents.forEach((a, i) => {
      const prefix = i === config.agents.length - 1 ? '└──' : '├──';
      console.log(chalk.gray(`  │   ${prefix} ${a}.md`));
    });
    console.log(chalk.gray('  └── instructions/'));
    const instrArray = Array.from(instructionsToCreate);
    instrArray.forEach((i, idx) => {
      const prefix = idx === instrArray.length - 1 ? '└──' : '├──';
      console.log(chalk.gray(`      ${prefix} ${i}.instructions.md`));
    });
    console.log(chalk.gray(''));
    console.log(chalk.gray('  AGENTS.md                      # Universal AI instructions'));
    if (config.includeMcp) {
      console.log(chalk.gray('  .vscode/mcp.json               # MCP configuration'));
    }
    
    console.log('');
    console.log(chalk.green('✓ GitHub Copilot will automatically load these instructions'));
    console.log('');
    console.log(chalk.bold('Next steps:'));
    console.log(chalk.cyan('  1. Review .github/copilot-instructions.md'));
    console.log(chalk.cyan('  2. Add agents with: cp-kit add agent <name>'));
    console.log(chalk.cyan('  3. Verify setup with: cp-kit doctor'));
    console.log('');
    
  } catch (error) {
    spinner.fail(chalk.red('Failed to initialize cp-kit'));
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

function generateCopilotInstructions(config) {
  const langList = config.languages.map(l => {
    switch (l) {
      case 'typescript': return '**TypeScript**: Strict mode, ESLint + Prettier';
      case 'python': return '**Python**: Black formatter, type hints, PEP 8';
      case 'react': return '**React**: Functional components, hooks, Testing Library';
      default: return l;
    }
  }).join('\n- ');

  return `# GitHub Copilot Instructions

> Repository-wide instructions for GitHub Copilot (2026 Standard)
> Generated by cp-kit v1.0.0

## Project Context

**${config.projectName}** is a ${config.projectType} project.

## Code Style

- ${langList}
- **Commits**: Conventional Commits format (\`feat:\`, \`fix:\`, \`docs:\`)

## AI Agent Protocol

### Available Agents

${config.agents.map(a => {
  const agent = TEMPLATE_AGENTS.find(t => t.name === a);
  return `- **@${a}**: ${agent?.description || 'Specialist agent'}`;
}).join('\n')}

### Invoking Agents

Use \`@agent-name\` in Copilot Chat:
\`\`\`
@frontend-specialist Create a responsive navbar component
@security-auditor Review this authentication flow
@orchestrator Implement user dashboard with API integration
\`\`\`

### Behavioral Modes

| Mode | Trigger | Behavior |
|------|---------|----------|
| **BRAINSTORM** | "let's think", "options" | Explore ideas, no code |
| **IMPLEMENT** | "build", "create" | Production-ready code |
| **DEBUG** | "fix", "why", "error" | Root cause analysis |
| **REVIEW** | "review", "check" | Quality assessment |

## Socratic Gate

For complex requests, **ASK before implementing**:
- What is the expected behavior?
- What are the edge cases?
- What are the dependencies?

## File References

- Agent definitions: \`.github/agents/\`
- Path-specific rules: \`.github/instructions/\`
- Universal instructions: \`AGENTS.md\`
${config.includeMcp ? `- MCP configuration: \`.vscode/mcp.json\`` : ''}

## Do NOT

- Skip understanding context before coding
- Write code without identifying the domain
- Ignore the Socratic Gate for complex requests
- Use deprecated patterns without checking instructions
`;
}

function generateAgentFile(agent) {
  return `---
name: ${agent.name}
description: ${agent.description}
---

# ${agent.name}

> ${agent.description}

## When to Use

Invoke this agent for:
${agent.triggers.map(t => `- ${t} related tasks`).join('\n')}

## Trigger Keywords

\`${agent.triggers.join('`, `')}\`

## Skills

${agent.skills.map(s => `- ${s}`).join('\n')}

## Response Format

\`\`\`
🤖 **Applying @${agent.name}...**

[specialized response following skill guidelines]
\`\`\`

## Integration

This agent can collaborate with:
- \`@orchestrator\` for multi-domain coordination
- Other specialists via handoff protocol
`;
}

function generateAgentsMd(config) {
  return `# AGENTS.md

> Universal Agent Instructions for AI Coding Assistants (2026 Standard)
> Generated by cp-kit v1.0.0

---

## 🏗️ Project Overview

**${config.projectName}** - ${config.projectType}

### Technologies

${config.languages.map(l => `- ${l.charAt(0).toUpperCase() + l.slice(1)}`).join('\n')}

---

## 🤖 AI Agent Protocol

### Available Agents

| Agent | Domain | Triggers |
|-------|--------|----------|
${config.agents.map(a => {
  const agent = TEMPLATE_AGENTS.find(t => t.name === a);
  return `| \`@${a}\` | ${agent?.description || '-'} | ${agent?.triggers.join(', ') || '-'} |`;
}).join('\n')}

### Request Classification

| Type | Keywords | Action |
|------|----------|--------|
| **QUESTION** | "what is", "explain" | Text response only |
| **SIMPLE CODE** | "fix", "add" (single file) | Inline edit |
| **COMPLEX CODE** | "build", "create" | Use @orchestrator |
| **REVIEW** | "review", "check" | Quality assessment |

### Behavioral Modes

| Mode | Behavior |
|------|----------|
| **BRAINSTORM** | Ask questions, explore options, no code |
| **IMPLEMENT** | Fast execution, production-ready code |
| **DEBUG** | Systematic investigation, root cause analysis |
| **REVIEW** | Code quality, security, performance check |

---

## 📂 Structure

\`\`\`
.github/
├── copilot-instructions.md    # Global instructions (always active)
├── agents/                    # Agent definitions
└── instructions/              # Path-specific rules
\`\`\`

---

*Generated by [cp-kit](https://github.com/anthropics/cp-kit) v1.0.0*
`;
}

function generateMcpConfig() {
  return {
    "$schema": "https://raw.githubusercontent.com/microsoft/vscode/main/src/vs/workbench/contrib/mcp/browser/mcpConfigSchema.json",
    servers: {
      filesystem: {
        type: "stdio",
        command: "npx",
        args: ["-y", "@anthropic-ai/mcp-server-filesystem@latest", "${workspaceFolder}"]
      },
      memory: {
        type: "stdio",
        command: "npx",
        args: ["-y", "@anthropic-ai/mcp-server-memory@latest"]
      },
      sequentialThinking: {
        type: "stdio",
        command: "npx",
        args: ["-y", "@anthropic-ai/mcp-server-sequential-thinking@latest"]
      }
    }
  };
}

export default initCommand;
