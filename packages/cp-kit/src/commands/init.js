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
  const templatesDir = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '../../templates');

  console.log(chalk.bold.cyan('\n🚀 cp-toolkit - GitHub Copilot Agent Toolkit\n'));
  
  // Create directory if needed
  if (directory && !fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(chalk.green(`📁 Created directory: ${dirName}`));
  }
  
  // Check for existing configuration
  const agentDir = path.join(targetDir, '.agent');
  if (fs.existsSync(agentDir) && !options.force) {
    const { overwrite } = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: 'cp-toolkit (.agent) already initialized. Overwrite?',
      initial: false
    });
    
    if (!overwrite) {
      console.log(chalk.yellow('⚠️  Aborted. Use --force to overwrite.'));
      return;
    }
  }

  // Interactive configuration
  let config = {
    projectName: dirName,
    installEverything: true
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
        type: 'confirm',
        name: 'installEverything',
        message: 'Install full Copilot Kit (Agents, Skills, Workflows)?',
        initial: true
      }
    ]);
     config = { ...config, ...response };
  }

  const spinner = ora('Installing Copilot Kit...').start();

  try {
    // 1. Copy Templates to .agent folder
    await fs.ensureDir(agentDir);
    await fs.copy(templatesDir, agentDir, {
      overwrite: true,
      filter: (src) => !src.includes('node_modules') && !src.includes('.git')
    });
    
    spinner.text = 'Configuring GitHub Copilot...';

    // 2. Setup .github/copilot-instructions.md
    const githubDir = path.join(targetDir, '.github');
    await fs.ensureDir(githubDir);
    
    const instructionsPath = path.join(githubDir, 'copilot-instructions.md');
    const instructionsContent = generateCopilotInstructions(config);
    await fs.writeFile(instructionsPath, instructionsContent);

    // 3. Setup .vscode/mcp.json
    spinner.text = 'Configuring MCP Server...';
    const vscodeDir = path.join(targetDir, '.vscode');
    await fs.ensureDir(vscodeDir);
    
    const mcpConfig = {
      "mcpServers": {
        "antigravity-toolkit": {
          "command": "node",
          "args": [
            "${workspaceFolder}/.agent/scripts/mcp-server.js"
          ],
          "env": {
            "AGENT_ROOT": "${workspaceFolder}/.agent"
          },
          "disabled": false,
          "autoApprove": []
        },
        "filesystem": {
          "command": "npx",
          "args": [
            "-y",
            "@modelcontextprotocol/server-filesystem",
            "${workspaceFolder}"
          ],
          "disabled": false,
          "autoApprove": []
        },
        "memory": {
          "command": "npx",
          "args": [
            "-y",
            "@modelcontextprotocol/server-memory"
          ],
          "disabled": false,
          "autoApprove": []
        }
      }
    };
    
    await fs.writeFile(
      path.join(vscodeDir, 'mcp.json'), 
      JSON.stringify(mcpConfig, null, 2)
    );

    // 4. Create root integration files if needed
    // Copy AGENTS.md if it exists in templates root (which is now in .agent)
    const agentsMdSrc = path.join(agentDir, 'AGENTS.md'); // Might not exist in root of reference
    // If reference had AGENTS.md in root, it should be in agentDir now if we copied everything.
    // Based on list_dir earlier, it wasn't there. It was likely outside. 
    // We will generate a basic one if missing.
    
    spinner.succeed(chalk.green('Copilot Kit installed successfully!'));
    
    console.log(chalk.bold('\nNext Steps:'));
    console.log(`1. Open ${chalk.cyan('.github/copilot-instructions.md')} to see the setup.`);
    console.log(`2. Reload Window to activate MCP server.`);
    console.log(`3. Try typing ${chalk.yellow('/create')} or ${chalk.yellow('Is the agent active?')} in Copilot Chat.`);

  } catch (error) {
    spinner.fail('Installation failed.');
    console.error(error);
  }
}

function generateAgentFile(agent) {
  // Deprecated generally, using static files now, but keeping for fallback
  return `---
name: ${agent.name}
description: ${agent.description}
skills: [${agent.skills.join(', ')}]
---

# ${agent.name}

${agent.description}
`;
}

function generateCopilotInstructions(config) {
  return `# GitHub Copilot Instructions

> **Copilot Kit Active**
> Profile: ${config.projectName}

## 🧠 Core Protocols

The user has installed the **Copilot Kit** in \`.agent/\`.
You must follow the rules defined in \`.agent/rules/GEMINI.md\`.

### Structure
- **Agents:** \`.agent/agents/\` (Specialist personas)
- **Skills:** \`.agent/skills/\` (Capabilities)
- **Workflows:** \`.agent/workflows/\` (Procedures)
- **Scripts:** \`.agent/scripts/\` (Tools)

## 🚀 Activation

When the user asks for a specific role or task, look up the corresponding agent in \`.agent/agents/\`.
Always read \`.agent/rules/GEMINI.md\` first.

## 🛠️ MCP Tools
An MCP server is configured at \`.agent/scripts/mcp-server.js\`.
Use it to list available tools, resources, and prompts.
`;
}

export default initCommand;


