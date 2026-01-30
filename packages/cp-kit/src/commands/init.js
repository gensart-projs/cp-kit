/**
 * cp-toolkit init command
 * 
 * Initializes Copilot Kit with GitHub Copilot 2026 standard structure.
 * Creates:
 *   .github/agents/       - Specialist agent definitions
 *   .github/instructions/ - Language/context-specific instructions  
 *   .github/copilot-instructions.md - Main Copilot config
 *   .vscode/mcp.json      - MCP server configuration
 */

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initCommand(directory, options) {
  const targetDir = directory ? path.resolve(directory) : process.cwd();
  const dirName = path.basename(targetDir);
  const templatesDir = path.join(__dirname, '../../templates');

  console.log(chalk.bold.cyan('\n🚀 cp-toolkit - GitHub Copilot Agent Toolkit\n'));
  
  // Create directory if needed
  if (directory && !fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(chalk.green(`📁 Created directory: ${dirName}`));
  }
  
  // Check for existing configuration
  const githubAgentsDir = path.join(targetDir, '.github', 'agents');
  if (fs.existsSync(githubAgentsDir) && !options.force) {
    const { overwrite } = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: 'Copilot Kit (.github/agents) already exists. Overwrite?',
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
        message: 'Install full Copilot Kit (Agents, Instructions, Workflows)?',
        initial: true
      }
    ]);
    config = { ...config, ...response };
  }

  const spinner = ora('Installing Copilot Kit...').start();

  try {
    // 1. Setup .github/agents/
    spinner.text = 'Copying agents...';
    const agentsSourceDir = path.join(templatesDir, 'agents');
    const agentsTargetDir = path.join(targetDir, '.github', 'agents');
    await fs.ensureDir(agentsTargetDir);
    await fs.copy(agentsSourceDir, agentsTargetDir, { overwrite: true });
    
    // 2. Setup .github/instructions/ (from skills that have instruction content)
    spinner.text = 'Copying instructions...';
    const instructionsTargetDir = path.join(targetDir, '.github', 'instructions');
    await fs.ensureDir(instructionsTargetDir);
    
    // Create standard instruction files
    await createInstructionFiles(instructionsTargetDir);
    
    // 4. Setup .github/skills/ (essential skills referenced by agents)
    spinner.text = 'Copying essential skills...';
    const skillsTargetDir = path.join(targetDir, '.github', 'skills');
    await fs.ensureDir(skillsTargetDir);
    
    // Copy essential skills that agents reference
    const essentialSkills = [
      'mobile-design',
      'frontend-design', 
      'api-patterns',
      'database-design',
      'testing-patterns',
      'deployment-procedures',
      'architecture'
    ];
    
    for (const skill of essentialSkills) {
      const skillSourceDir = path.join(templatesDir, 'skills', 'optional', skill);
      if (fs.existsSync(skillSourceDir)) {
        const skillTargetDir = path.join(skillsTargetDir, skill);
        await fs.ensureDir(skillTargetDir);
        await fs.copy(skillSourceDir, skillTargetDir, { overwrite: true });
      }
    }
    
    // 5. Setup .github/copilot-instructions.md
    spinner.text = 'Creating copilot-instructions.md...';
    const instructionsPath = path.join(targetDir, '.github', 'copilot-instructions.md');
    const instructionsContent = generateCopilotInstructions(config);
    await fs.writeFile(instructionsPath, instructionsContent);

    // 6. Setup .vscode/mcp.json
    spinner.text = 'Configuring MCP Server...';
    const vscodeDir = path.join(targetDir, '.vscode');
    await fs.ensureDir(vscodeDir);
    
    const mcpConfig = {
      "mcpServers": {
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

    // 7. Copy workflows to .github/workflows-copilot/ (optional reference)
    if (config.installEverything) {
      spinner.text = 'Copying workflows...';
      const workflowsSourceDir = path.join(templatesDir, 'workflows');
      const workflowsTargetDir = path.join(targetDir, '.github', 'copilot-workflows');
      if (fs.existsSync(workflowsSourceDir)) {
        await fs.ensureDir(workflowsTargetDir);
        await fs.copy(workflowsSourceDir, workflowsTargetDir, { overwrite: true });
      }
    }

    spinner.succeed(chalk.green('✨ Copilot Kit initialized successfully!'));
    
    console.log(chalk.bold('\n📁 Created structure:'));
    console.log(chalk.dim('   .github/'));
    console.log(chalk.dim('   ├── agents/           ') + chalk.cyan('← 20 specialist agents'));
    console.log(chalk.dim('   ├── skills/           ') + chalk.cyan('← Essential skills library'));
    console.log(chalk.dim('   ├── instructions/     ') + chalk.cyan('← Language-specific rules'));
    console.log(chalk.dim('   ├── copilot-workflows/') + chalk.cyan('← Workflow templates'));
    console.log(chalk.dim('   └── copilot-instructions.md'));
    console.log(chalk.dim('   .vscode/'));
    console.log(chalk.dim('   └── mcp.json          ') + chalk.cyan('← MCP server config'));
    
    console.log(chalk.bold('\n🚀 Next Steps:'));
    console.log(`   1. ${chalk.cyan('Reload VS Code window')} to activate MCP servers`);
    console.log(`   2. Open Copilot Chat and try: ${chalk.yellow('@workspace use the orchestrator agent')}`);
    console.log(`   3. Or try a workflow: ${chalk.yellow('/create a React component')}`);

  } catch (error) {
    spinner.fail(chalk.red('❌ Failed to initialize Copilot Kit'));
    console.error(chalk.dim(error.message));
    if (options.verbose) {
      console.error(error);
    }
  }
}

async function createInstructionFiles(instructionsDir) {
  const instructions = {
    'typescript.instructions.md': `---
applyTo: "**/*.ts,**/*.tsx,**/*.mts,**/*.cts"
---

# TypeScript Guidelines

## Strict Mode
- Enable \`strict: true\` in tsconfig.json
- No \`any\` types - use \`unknown\` and narrow with type guards
- Explicit return types for public functions

## Patterns
- Prefer \`interface\` over \`type\` for object shapes
- Use \`as const\` for literal types
- Leverage discriminated unions for state

## Imports
- Use type-only imports: \`import type { X } from 'y'\`
- Barrel exports for public APIs only
`,

    'python.instructions.md': `---
applyTo: "**/*.py"
---

# Python Guidelines

## Type Hints
- Use type hints for all function signatures
- Use \`from __future__ import annotations\` for forward refs
- Prefer \`typing.Optional\` over \`X | None\` for Python 3.9 compat

## Patterns
- Use dataclasses or Pydantic for data structures
- Async/await for I/O bound operations
- Context managers for resource management

## Style
- Follow PEP 8
- Use Black for formatting
- Docstrings in Google style
`,

    'security.instructions.md': `---
applyTo: "**/auth/**,**/security/**,**/*auth*,**/*token*,**/*session*"
---

# Security Guidelines

## Authentication
- JWT with short expiry + refresh tokens
- HttpOnly cookies for web sessions
- Rate limit authentication endpoints

## Authorization
- RBAC or ABAC patterns
- Check permissions server-side always
- Deny by default, allow explicitly

## Data Protection
- Sanitize all user inputs
- Escape outputs by context (HTML, SQL, etc.)
- Never log sensitive data (passwords, tokens, PII)

## OWASP Top 10
- Validate content types
- CSRF tokens for state-changing operations
- Security headers (CSP, HSTS, X-Frame-Options)
`,

    'database.instructions.md': `---
applyTo: "**/prisma/**,**/*.sql,**/migrations/**,**/schema.*,**/db/**"
---

# Database Guidelines

## Schema Design
- UUID or ULID for primary keys
- Timestamps: createdAt, updatedAt on all tables
- Soft delete with deletedAt when needed

## Queries
- Use parameterized queries only (never string concat)
- Select only needed fields
- Use cursor-based pagination for large datasets

## Prisma
- Use transactions for multi-table operations
- Define indexes for frequently queried fields
- Use \`@map\` and \`@@map\` for legacy schemas

## Migrations
- One migration per feature
- Never modify already-applied migrations
- Test migrations on copy of production data
`
  };

  for (const [filename, content] of Object.entries(instructions)) {
    await fs.writeFile(path.join(instructionsDir, filename), content);
  }
}

function generateCopilotInstructions(config) {
  return `# GitHub Copilot Instructions

> **Copilot Kit v2** - Project: ${config.projectName}

## 🤖 Agent System

This project uses specialized AI agents located in \`.github/agents/\`.

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

Context-specific rules are in \`.github/instructions/\`:
- \`typescript.instructions.md\` - TS/TSX files
- \`python.instructions.md\` - Python files
- \`security.instructions.md\` - Auth/security code
- \`database.instructions.md\` - Database/Prisma code

## 🔧 MCP Servers

Configured in \`.vscode/mcp.json\`:
- **filesystem** - File system access
- **memory** - Persistent memory across sessions

## 🚀 Workflows

Workflow templates in \`.github/copilot-workflows/\`:
- \`/create\` - Scaffold new features
- \`/debug\` - Systematic debugging
- \`/test\` - Generate test suites
- \`/plan\` - Architecture planning

## 📝 General Guidelines

1. **Read before writing** - Understand existing patterns
2. **Small, focused changes** - One concern per commit
3. **Test coverage** - Write tests for new features
4. **Security first** - Validate inputs, sanitize outputs
`;
}

export default initCommand;


