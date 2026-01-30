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

    // 6. Setup .github/cp-kit-models.yaml
    spinner.text = 'Creating cp-kit-models.yaml...';
    const modelsPath = path.join(targetDir, '.github', 'cp-kit-models.yaml');
    const modelsContent = generateModelsConfig();
    await fs.writeFile(modelsPath, modelsContent);

    // 7. Setup .vscode/mcp.json
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
        },
        "antigravity": {
          "command": "node",
          "args": [
            "${workspaceFolder}/.github/scripts/mcp-server.js"
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

    // 8. Copy workflows to .github/workflows-copilot/ (optional reference)
    if (config.installEverything) {
      spinner.text = 'Copying workflows...';
      const workflowsSourceDir = path.join(templatesDir, 'workflows');
      const workflowsTargetDir = path.join(targetDir, '.github', 'copilot-workflows');
      if (fs.existsSync(workflowsSourceDir)) {
        await fs.ensureDir(workflowsTargetDir);
        await fs.copy(workflowsSourceDir, workflowsTargetDir, { overwrite: true });
      }
    }

    // 9. Copy scripts to .github/scripts/
    spinner.text = 'Copying scripts...';
    const scriptsSourceDir = path.join(templatesDir, 'scripts');
    const scriptsTargetDir = path.join(targetDir, '.github', 'scripts');
    if (fs.existsSync(scriptsSourceDir)) {
      await fs.ensureDir(scriptsTargetDir);
      await fs.copy(scriptsSourceDir, scriptsTargetDir, { overwrite: true });
    }

    // 10. Copy ARCHITECTURE.md to .github/
    spinner.text = 'Copying architecture documentation...';
    const architectureSource = path.join(templatesDir, 'ARCHITECTURE.md');
    const architectureTarget = path.join(targetDir, '.github', 'ARCHITECTURE.md');
    if (fs.existsSync(architectureSource)) {
      await fs.copy(architectureSource, architectureTarget, { overwrite: true });
    }

    // 11. Copy rules to .github/rules/
    spinner.text = 'Copying rules...';
    const rulesSourceDir = path.join(templatesDir, 'rules');
    const rulesTargetDir = path.join(targetDir, '.github', 'rules');
    if (fs.existsSync(rulesSourceDir)) {
      await fs.ensureDir(rulesTargetDir);
      await fs.copy(rulesSourceDir, rulesTargetDir, { overwrite: true });
    }

    // 12. Copy AGENTS.md to root (required by doctor)
    spinner.text = 'Copying AGENTS.md...';
    const agentsSource = path.join(templatesDir, 'AGENTS.md');
    const agentsTarget = path.join(targetDir, 'AGENTS.md');
    if (fs.existsSync(agentsSource)) {
      await fs.copy(agentsSource, agentsTarget, { overwrite: true });
    }

    spinner.succeed(chalk.green('✨ Copilot Kit initialized successfully!'));

    console.log(chalk.bold('\n📁 Created structure:'));
    console.log(chalk.dim('   .github/'));
    console.log(chalk.dim('   ├── agents/           ') + chalk.cyan('← 20 specialist agents'));
    console.log(chalk.dim('   ├── skills/           ') + chalk.cyan('← Essential skills library'));
    console.log(chalk.dim('   ├── instructions/     ') + chalk.cyan('← 10 specialized instruction files'));
    console.log(chalk.dim('   │   ├── typescript-development.instructions.md'));
    console.log(chalk.dim('   │   ├── javascript-development.instructions.md'));
    console.log(chalk.dim('   │   ├── react-development.instructions.md'));
    console.log(chalk.dim('   │   ├── nextjs-development.instructions.md'));
    console.log(chalk.dim('   │   ├── python-development.instructions.md'));
    console.log(chalk.dim('   │   ├── security-development.instructions.md'));
    console.log(chalk.dim('   │   ├── database-development.instructions.md'));
    console.log(chalk.dim('   │   ├── testing-development.instructions.md'));
    console.log(chalk.dim('   │   ├── api-development.instructions.md'));
    console.log(chalk.dim('   │   └── github-actions.instructions.md'));
    console.log(chalk.dim('   ├── copilot-workflows/') + chalk.cyan('← Workflow templates'));
    console.log(chalk.dim('   │   ├── architect-builder.workflow.md ') + chalk.yellow('← 🏗️ Protocol for complex tasks'));
    console.log(chalk.dim('   │   ├── brainstorm.md'));
    console.log(chalk.dim('   │   ├── create.md'));
    console.log(chalk.dim('   │   ├── debug.md'));
    console.log(chalk.dim('   │   ├── plan.md'));
    console.log(chalk.dim('   │   └── orchestrate.md'));
    console.log(chalk.dim('   ├── scripts/          ') + chalk.cyan('← MCP server & utilities'));
    console.log(chalk.dim('   ├── rules/            ') + chalk.cyan('← Global AI rules'));
    console.log(chalk.dim('   ├── cp-kit-models.yaml') + chalk.cyan('← AI model allocation matrix'));
    console.log(chalk.dim('   ├── ARCHITECTURE.md   ') + chalk.cyan('← System documentation'));
    console.log(chalk.dim('   └── copilot-instructions.md'));
    console.log(chalk.dim('   .vscode/'));
    console.log(chalk.dim('   └── mcp.json          ') + chalk.cyan('← MCP server config'));

    console.log(chalk.bold('\n🚀 Next Steps:'));
    console.log(`   1. ${chalk.cyan('Reload VS Code window')} to activate MCP servers`);
    console.log(`   2. Open Copilot Chat and try: ${chalk.yellow('@workspace use the orchestrator agent')}`);
    console.log(`   3. Try the Architect-Builder Protocol: ${chalk.yellow('Read .github/copilot-workflows/architect-builder.workflow.md')}`);
    console.log(`   4. Or try a workflow: ${chalk.yellow('/create a React component')}`);
    console.log(chalk.green('\n✅ Smart Context patterns applied to agents.'));

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
    'typescript-development.instructions.md': `---
name: typescript-development
description: Strict guidelines for TypeScript development including type safety, modules, and error handling.
version: 1.0
applyTo: "**/*.ts,**/*.tsx,**/*.mts,**/*.cts"
---

# TypeScript Development Guidelines

## Strict Mode & Type Safety
- Enable \`strict: true\` in tsconfig.json
- No \`any\` types - use \`unknown\` and narrow with type guards
- Explicit return types for public functions
- Use \`strictNullChecks\` and \`noImplicitAny\`

## Code Patterns
- Prefer \`interface\` over \`type\` for object shapes
- Use \`as const\` for literal types and enums
- Leverage discriminated unions for state management
- Use mapped types for transformations
- Prefer \`readonly\` for immutable data

## Imports & Modules
- Use type-only imports: \`import type { X } from 'y'\`
- Barrel exports for public APIs only
- Avoid relative imports with \`../\` - use absolute paths

## Error Handling
- Use custom error classes extending \`Error\`
- Prefer Result types over throwing exceptions
- Use try/catch only for external operations
`,

    'javascript-development.instructions.md': `---
name: javascript-development
description: Best practices for modern JavaScript development including ES6+ features and functional patterns.
version: 1.0
applyTo: "**/*.js,**/*.mjs,**/*.cjs"
---

# JavaScript Development Guidelines

## ES6+ Features
- Use \`const\` and \`let\` instead of \`var\`
- Arrow functions for callbacks and anonymous functions
- Template literals over string concatenation
- Destructuring for objects and arrays
- Spread/rest operators for manipulation

## Code Patterns
- Prefer functional programming approaches
- Use async/await over Promises for readability
- Implement proper error handling with try/catch
- Use Map/Set for collections when appropriate
- Leverage object destructuring for configuration

## Best Practices
- Strict mode: \`'use strict'\` at file/module level
- Consistent naming: camelCase for variables/functions
- Meaningful variable names over abbreviations
- Single responsibility principle for functions

## Performance
- Avoid global variables
- Use efficient algorithms and data structures
- Minimize DOM manipulation
- Cache expensive operations
`,

    'react-development.instructions.md': `---
name: react-development
description: Component patterns, state management, and accessibility standards for React development.
version: 1.0
applyTo: "**/*.jsx,**/*.tsx,**/*react*"
---

# React Development Guidelines

## Component Patterns
- Functional components with hooks over class components
- Custom hooks for reusable logic
- Compound components for complex UI patterns
- Container/Presentational separation when appropriate

## State Management
- useState for local component state
- useReducer for complex state logic
- Context API for theme/configuration
- External libraries (Zustand, Redux) for app-wide state

## Performance
- React.memo for expensive components
- useMemo for expensive calculations
- useCallback for event handlers
- Lazy loading with React.lazy and Suspense
- Code splitting for large applications

## Hooks Best Practices
- Custom hooks for side effects
- useEffect cleanup functions
- Dependency arrays correctly specified
- Avoid conditional hook calls

## Accessibility
- Semantic HTML elements
- ARIA attributes when needed
- Keyboard navigation support
- Screen reader compatibility
`,

    'nextjs-development.instructions.md': `---
name: nextjs-development
description: Guidelines for Next.js development including App Router, Server Components, and SEO optimization.
version: 1.0
applyTo: "**/app/**,**/components/**,**/lib/**,**/utils/**"
---

# Next.js Development Guidelines

## App Router (App Directory)
- Server Components by default
- Client Components with 'use client' directive
- Server Actions for form handling
- Route Groups for organization: (auth), (dashboard)

## File Structure
- \`app/\` for routing and layouts
- \`components/\` for reusable UI
- \`lib/\` for utilities and configurations
- \`utils/\` for helper functions
- \`types/\` for TypeScript definitions

## Data Fetching
- Server Components for initial data
- Client Components for interactive data
- SWR or React Query for client-side fetching
- Server Actions for mutations

## Performance
- Image optimization with next/image
- Font optimization with next/font
- Code splitting automatic
- Static generation when possible
- ISR for dynamic content

## SEO & Metadata
- Metadata API for dynamic meta tags
- Static metadata exports
- Open Graph and Twitter cards
- Structured data with JSON-LD
`,

    'python-development.instructions.md': `---
name: python-development
description: Best practices for Python development including type hints, async/await, and testing.
version: 1.0
applyTo: "**/*.py"
---

# Python Development Guidelines

## Type Hints & Annotations
- Use type hints for all function signatures
- Use \`from __future__ import annotations\` for forward refs
- Prefer \`typing.Optional\` over \`X | None\` for Python 3.9 compat
- Generic types with \`TypeVar\` when needed

## Code Patterns
- Use dataclasses or Pydantic for data structures
- Async/await for I/O bound operations
- Context managers (\`with\` statements) for resource management
- List/dict comprehensions for transformations
- Generator functions for large datasets

## Best Practices
- Follow PEP 8 style guidelines
- Use Black for code formatting
- Google/NumPy style docstrings
- Meaningful variable names
- Single responsibility principle

## Error Handling
- Custom exception classes
- Specific exception types over generic Exception
- Proper exception chaining
- Logging with appropriate levels

## Testing
- pytest framework preferred
- Unit tests for functions/classes
- Integration tests for workflows
- Mock external dependencies
`,

    'security-development.instructions.md': `---
name: security-development
description: Comprehensive security guidelines including auth, data protection, and web security.
version: 1.0
applyTo: "**/auth/**,**/security/**,**/*auth*,**/*token*,**/*session*,**/middleware/**"
---

# Security Development Guidelines

## Authentication & Authorization
- JWT with short expiry + refresh tokens
- HttpOnly cookies for web sessions
- Rate limiting on authentication endpoints
- RBAC or ABAC patterns implemented
- Server-side permission checks always

## Data Protection
- Input sanitization and validation
- Output encoding by context (HTML, SQL, JSON)
- Never log sensitive data (passwords, tokens, PII)
- Encryption at rest and in transit
- Secure password hashing (bcrypt, Argon2)

## Web Security
- CSRF tokens for state-changing operations
- Content Security Policy (CSP) headers
- HTTPS enforcement (HSTS)
- Secure headers (X-Frame-Options, etc.)
- XSS prevention with proper escaping

## API Security
- API versioning for breaking changes
- Request/response validation schemas
- CORS configuration for allowed origins
- API rate limiting and throttling
- Proper error messages (no sensitive info)

## OWASP Top 10
- Injection prevention (parameterized queries)
- Broken authentication handling
- Sensitive data exposure protection
- XML external entity prevention
- Access control enforcement
`,

    'database-development.instructions.md': `---
name: database-development
description: Standards for schema design, query optimization, and database migrations.
version: 1.0
applyTo: "**/prisma/**,**/*.sql,**/migrations/**,**/schema.*,**/db/**,**/models/**"
---

# Database Development Guidelines

## Schema Design
- UUID or ULID for primary keys (not auto-increment)
- Timestamps: createdAt, updatedAt on all tables
- Soft delete with deletedAt when needed
- Proper foreign key relationships
- Normalized schemas with good indexing

## Query Optimization
- Use parameterized queries only (never string concat)
- Select only needed fields (avoid SELECT *)
- Use cursor-based pagination for large datasets
- Proper indexing on frequently queried fields
- Query execution plan analysis

## ORM Best Practices
- Use transactions for multi-table operations
- N+1 query problem avoidance
- Proper eager/lazy loading
- Migration scripts for schema changes
- Database constraints and validations

## Migration Safety
- One migration per feature/change
- Never modify already-applied migrations
- Test migrations on production-like data
- Rollback scripts for emergency recovery
- Version control for migration files

## Performance
- Connection pooling configuration
- Query result caching strategies
- Database indexing strategy
- Read/write splitting when appropriate
- Monitoring and alerting setup
`,

    'testing-development.instructions.md': `---
name: testing-development
description: Guidelines for test structure, frameworks, and code coverage best practices.
version: 1.0
applyTo: "**/*.test.*,**/*.spec.*,**/tests/**,**/__tests__/**"
---

# Testing Development Guidelines

## Test Structure
- Unit tests for individual functions/classes
- Integration tests for component interactions
- End-to-end tests for user workflows
- Performance tests for critical paths
- Accessibility tests for UI components

## Testing Frameworks
- Jest for JavaScript/TypeScript
- pytest for Python
- RSpec for Ruby
- JUnit for Java
- Appropriate framework per language

## Test Patterns
- Arrange-Act-Assert (AAA) pattern
- Descriptive test names (not test1, test2)
- One assertion per test when possible
- Mock external dependencies
- Test edge cases and error conditions

## Code Coverage
- Aim for 80%+ coverage on critical code
- Focus on business logic over getters/setters
- Integration tests for coverage gaps
- Coverage reports in CI/CD pipeline

## Best Practices
- Tests run independently (no shared state)
- Fast execution for developer experience
- CI/CD integration with quality gates
- Test data management and cleanup
- Documentation of test scenarios
`,

    'api-development.instructions.md': `---
name: api-development
description: RESTful API design standards including versioning, error handling, and documentation.
version: 1.0
applyTo: "**/api/**,**/routes/**,**/controllers/**,**/services/**,**/*api*,**/*endpoint*"
---

# API Development Guidelines

## RESTful Design
- Proper HTTP methods (GET, POST, PUT, DELETE)
- Resource-based URLs (/users, /users/{id})
- Status codes: 200, 201, 400, 401, 403, 404, 500
- Content-Type and Accept headers
- Idempotent operations where appropriate

## API Versioning
- URL versioning: /api/v1/users
- Header versioning when needed
- Backward compatibility maintenance
- Deprecation notices for breaking changes
- Version documentation

## Request/Response
- JSON as primary format
- Consistent response structure
- Pagination for list endpoints
- Filtering and sorting parameters
- Rate limiting headers

## Error Handling
- Consistent error response format
- Appropriate HTTP status codes
- User-friendly error messages
- Error logging and monitoring
- Graceful degradation

## Documentation
- OpenAPI/Swagger specifications
- Interactive API documentation
- Authentication examples
- Rate limiting information
- Changelog for API versions
`,

    'github-actions.instructions.md': `---
name: github-actions
description: Standards for GitHub Actions workflows including security, performance, and best practices.
version: 1.0
applyTo: ".github/workflows/**/*.yml,.github/workflows/**/*.yaml"
---

# GitHub Actions Development Guidelines

## Workflow Structure
- Descriptive workflow names and jobs
- Matrix builds for multiple environments
- Proper job dependencies with needs
- Conditional execution with if statements
- Timeout settings for long-running jobs

## Security
- Use trusted actions from GitHub Marketplace
- Pin action versions to specific SHAs
- Use secrets for sensitive data
- CodeQL for security scanning
- Dependency review for PRs

## Best Practices
- Cache dependencies for faster builds
- Use self-hosted runners when appropriate
- Proper artifact management
- Notification configuration
- Workflow reusability with composite actions

## CI/CD Pipeline
- Build → Test → Deploy stages
- Parallel job execution
- Failure handling and notifications
- Rollback capabilities
- Environment-specific configurations

## Performance
- Efficient caching strategies
- Minimal artifact sizes
- Parallel job execution
- Resource optimization
- Build time monitoring
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
- \`typescript-development.instructions.md\` - TypeScript files
- \`javascript-development.instructions.md\` - JavaScript files
- \`react-development.instructions.md\` - React components
- \`nextjs-development.instructions.md\` - Next.js applications
- \`python-development.instructions.md\` - Python files
- \`security-development.instructions.md\` - Auth/security code
- \`database-development.instructions.md\` - Database/ORM code
- \`testing-development.instructions.md\` - Test files
- \`api-development.instructions.md\` - API endpoints
- \`github-actions.instructions.md\` - GitHub Actions workflows

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

function generateModelsConfig() {
  return `# .github/cp-kit-models.yaml
# Matriz de Alocação de Modelos v3.0 (Full 20-Agent Suite)
# Strategy: Architect-Builder Pattern (Hybrid) + Community Consensus 2026

defaults:
  temperature_planner: 0.1 # Raciocínio frio
  temperature_executor: 0.3 # Criatividade controlada para código
  fallback_model: "gpt-5.1-codex"

agents:
  # ==============================================================================
  # 1. LIDERANÇA E ESTRATÉGIA (Pure Reasoning)
  # ==============================================================================
  orchestrator:
    mode: "single"
    model: "claude-opus-4.5"
    reason: "Capacidade superior de manter o contexto de múltiplos agentes e passos."

  product-manager:
    mode: "single"
    model: "gpt-5.2"
    reason: "Equilíbrio ideal entre visão de negócios e viabilidade técnica."

  product-owner:
    mode: "single"
    model: "gemini-3-pro" # (Preview)
    reason: "Context window massiva para ingerir todo o histórico e backlog do produto."

  project-planner:
    mode: "single"
    model: "gpt-5.2"
    reason: "Lógica temporal robusta para cronogramas, dependências e caminho crítico."

  # ==============================================================================
  # 2. DESENVOLVIMENTO CORE (Architect-Builder Hybrid)
  # ==============================================================================
  backend-specialist:
    mode: "hybrid"
    planner:
      model: "gpt-5.2"
      task: "Arquitetura de API, segurança e modelagem de dados."
    executor:
      model: "gpt-5.2-codex"
      task: "Implementação estrita de rotas e serviços com tipagem perfeita."

  frontend-specialist:
    mode: "hybrid"
    planner:
      model: "claude-opus-4.5"
      task: "Definição de UX, Acessibilidade e Component Tree."
    executor:
      model: "claude-sonnet-4.5"
      task: "Geração de React/CSS visualmente fiel e sem alucinações de layout."

  mobile-developer:
    mode: "hybrid"
    planner:
      model: "claude-opus-4.5"
      task: "Arquitetura nativa vs híbrida e gerenciamento de estado complexo."
    executor:
      model: "claude-sonnet-4.5"
      task: "Escrita de SwiftUI/Kotlin com sintaxe declarativa aninhada."

  game-developer:
    mode: "hybrid"
    planner:
      model: "gpt-5.2"
      task: "Design de sistemas de jogo, física e loop principal."
    executor:
      model: "gpt-5.1-codex-max"
      task: "Cálculos vetoriais pesados e otimização de C++/C#."

  # ==============================================================================
  # 3. INFRAESTRUTURA E OPERAÇÕES (High Cost Savings)
  # ==============================================================================
  devops-engineer:
    mode: "hybrid"
    planner:
      model: "claude-opus-4.5"
      task: "Estratégia de Cloud, segurança de pipelines e disaster recovery."
    executor:
      model: "grok-code-fast-1" # Economia extrema aqui
      task: "Geração rápida de YAMLs, Dockerfiles e scripts Bash."

  database-architect:
    mode: "hybrid"
    planner:
      model: "gpt-5.2"
      task: "Modelagem ER, normalização e estratégia de indexação."
    executor:
      model: "gpt-5.1-codex"
      task: "Geração de SQL complexo, migrations e triggers."

  security-auditor:
    mode: "single"
    model: "claude-opus-4.5"
    reason: "Raciocínio paranoico necessário para auditoria (Red Teaming)."

  penetration-tester:
    mode: "hybrid"
    planner:
      model: "gpt-5.2"
      task: "Planejamento de vetores de ataque e engenharia social."
    executor:
      model: "gpt-5.2-codex"
      task: "Criação de exploits e scripts de teste de penetração."

  # ==============================================================================
  # 4. QUALIDADE E OTIMIZAÇÃO
  # ==============================================================================
  qa-automation-engineer:
    mode: "hybrid"
    planner:
      model: "gpt-5.2"
      task: "Estratégia de testes E2E e cobertura de cenários críticos."
    executor:
      model: "gpt-5.1-codex-mini" # (Preview)
      task: "Escrita em massa de scripts Cypress/Playwright."

  test-engineer:
    mode: "single"
    model: "gpt-5.1-codex-max"
    reason: "Foco total em cobertura de testes unitários e mocks."

  debugger:
    mode: "single"
    model: "claude-opus-4.5"
    reason: "Melhor modelo para análise causal de logs e stack traces."

  performance-optimizer:
    mode: "hybrid"
    planner:
      model: "gpt-5.2"
      task: "Profiling e identificação de gargalos algorítmicos."
    executor:
      model: "gpt-5.1-codex-max"
      task: "Refatoração de código para redução de complexidade Big O."

  # ==============================================================================
  # 5. ESPECIALISTAS E PESQUISA
  # ==============================================================================
  code-archaeologist:
    mode: "hybrid"
    planner:
      model: "gemini-3-pro" # (Preview)
      task: "Leitura de todo o repositório legado para entender dependências."
    executor:
      model: "gpt-5.1-codex"
      task: "Refatoração cirúrgica sem quebrar compatibilidade."

  documentation-writer:
    mode: "single"
    model: "claude-sonnet-4.5"
    reason: "Texto técnico mais natural, empático e bem formatado."

  seo-specialist:
    mode: "single"
    model: "gemini-3-flash" # (Preview)
    reason: "Acesso rápido a dados da web e tendências de busca em tempo real."

  explorer-agent:
    mode: "single"
    model: "raptor-mini" # (Preview)
    reason: "Pensamento lateral rápido e brainstorming divergente."`;
}

export default initCommand;


