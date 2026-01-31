/**
 * cp-kit add command
 * 
 * Add new agents or instructions to a cp-kit project.
 */

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import prompts from 'prompts';

const AGENT_TEMPLATES = {
  specialist: (name, description, triggers) => `---
name: ${name}
description: ${description}
model: gpt-4o
capabilities:
  - clean-code
handoffs:
  - project-planner
---

# ${name}

> ${description}

## When to Use

Invoke this agent for:
${triggers.map(t => `- ${t} related tasks`).join('\n')}

## Trigger Keywords

\`${triggers.join('`, `')}\`

## Response Format

\`\`\`
🤖 **Applying @${name}...**

[specialized response]
\`\`\`
`,
  reviewer: (name, description, triggers) => `---
name: ${name}
description: ${description}
model: gpt-4o
capabilities:
  - clean-code
  - qa-automation-engineer
handoffs:
  - project-planner
---

# ${name}

> ${description}

## Review Checklist

- [ ] Code follows project conventions
- [ ] No security vulnerabilities
- [ ] Adequate test coverage
- [ ] Performance considerations
- [ ] Documentation updated

## Trigger Keywords

\`${triggers.join('`, `')}\`

## Response Format

\`\`\`
🔍 **Review by @${name}**

### Summary
[brief overview]

### Issues Found
[list with severity]

### Recommendations
[suggested improvements]
\`\`\`
`
};

const SKILL_TEMPLATE = (name, description) => `---
name: ${name}
description: ${description}
version: 1.0.0
---

# Skill: ${name}

> ${description}

## Context & Rules
- [Rule 1]
- [Rule 2]

## Code Snippets
\`\`\`javascript
// Example code for this skill
\`\`\`
`;

export async function addCommand(type, name, options) {
  const targetDir = process.cwd();

  // Validate type
  const validTypes = ['agent', 'instruction', 'skill'];
  if (!validTypes.includes(type)) {
    console.log(chalk.red(`❌ Unknown type: ${type}`));
    console.log(chalk.dim(`   Valid types: ${validTypes.join(', ')}`));
    return;
  }

  // Check if cp-kit is initialized
  const githubDir = path.join(targetDir, '.github');
  if (!fs.existsSync(path.join(githubDir, 'copilot-instructions.md'))) {
    console.log(chalk.red('❌ cp-kit not initialized.'));
    console.log(chalk.dim('   Run: cp-kit init'));
    return;
  }

  console.log(chalk.bold.cyan(`\n➕ Adding ${type}: ${name}\n`));

  switch (type) {
    case 'agent':
      await addAgent(githubDir, name, options);
      break;
    case 'skill':
      await addSkill(githubDir, name, options);
      break;
    case 'instruction':
      await addInstruction(githubDir, name, options);
      break;
  }
}

async function addAgent(githubDir, name, options) {
  const agentFile = path.join(githubDir, 'agents', `${name}.agent.md`);

  if (fs.existsSync(agentFile)) {
    console.log(chalk.yellow(`⚠️  Agent "${name}" already exists.`));
    return;
  }

  const response = await prompts([
    {
      type: 'text',
      name: 'description',
      message: 'Agent description:',
      initial: `${name} specialist agent`
    },
    {
      type: 'text',
      name: 'triggers',
      message: 'Trigger keywords (comma-separated):',
      initial: name.replace(/-/g, ', ')
    },
    {
      type: 'select',
      name: 'template',
      message: 'Template:',
      choices: [
        { title: 'Specialist - General purpose', value: 'specialist' },
        { title: 'Reviewer - Code review focus', value: 'reviewer' }
      ]
    }
  ]);

  if (!response.description) {
    console.log(chalk.yellow('Aborted.'));
    return;
  }

  const triggers = response.triggers.split(',').map(t => t.trim());
  const content = AGENT_TEMPLATES[response.template](name, response.description, triggers);

  await fs.ensureDir(path.dirname(agentFile));
  await fs.writeFile(agentFile, content);

  console.log(chalk.green(`✅ Created agent: .github/agents/${name}.agent.md`));
  console.log(chalk.dim(`   Invoke with @${name} in Copilot Chat`));

  // Offer to scaffold supporting skill + instruction for Convex
  if (name === 'convex-specialist') {
    const resp2 = await prompts({
      type: 'confirm',
      name: 'scaffold',
      message: 'Scaffold supporting skill and instruction for Convex (convex-patterns + convex-development)?',
      initial: true
    });

    if (resp2.scaffold) {
      const skillDir = path.join(githubDir, 'skills', 'convex-patterns');
      const instrFile = path.join(githubDir, 'instructions', 'convex-development.instructions.md');

      const SKILL_MD = `---\nname: convex-patterns\ndescription: Convex reference patterns: schema design, reactive queries, functions, and LLM integration patterns.\nversion: 1.0\nallowed-tools: ['read','search']\n---\n\n# Skill: Convex Patterns\n\n> Short reference to use Convex safely and effectively, plus common LLM integration patterns.`;

      const LLMS_REF = `# Convex + LLMs — Quick Reference\n\nThis file summarizes patterns for using Convex alongside LLMs. It is intentionally concise and decision-focused.`;

      const API_REF = `# Convex API Reference — Essentials\n\nSmall set of examples and reminders for common operations.`;

      const BEST_PRACTICES = `# Convex Best Practices\n\n- Schema design: favor flatter documents for common queries; add secondary collections for denormalized read patterns when necessary.`;

      const SYNC_PY = `#!/usr/bin/env python3\n\n"""Simple sync script to fetch Convex llms.txt and save a local copy."""\n\nimport sys\nfrom pathlib import Path\n\ntry:\n    import requests\nexcept ImportError:\n    print("requests package is required. Install with: pip install requests")\n    sys.exit(1)\n\nROOT = Path(__file__).resolve().parent.parent\nOUT_FILE = ROOT / "llms-source.txt"\nURLS = [\n    "https://www.convex.dev/llms.txt",\n    "https://docs.convex.dev/llms.txt"\n]\n\nif __name__ == "__main__":\n    combined = []\n    for u in URLS:\n        try:\n            r = requests.get(u, timeout=10)\n            r.raise_for_status()\n            combined.append(f"# Source: {u}\n\n" + r.text)\n        except Exception as e:\n            print(f"Failed to fetch {u}: {e}")\n\n    if not combined:\n        print("No content fetched.")\n        sys.exit(1)\n\n    OUT_FILE.write_text("\n\n".join(combined), encoding="utf-8")\n    print(f"Saved docs to {OUT_FILE}")`;

      const INSTR_MD = `---\nname: convex-development\ndescription: Guidelines for working with Convex-backed functions, schemas, and integrations with LLMs.\nversion: 1.0\napplyTo: "**/convex/**,**/functions/**,**/*convex*.*"\n---\n\n## Convex Development Guidelines\n\n> Short checklists and rules to follow when adding Convex-backed features.`;

      await fs.ensureDir(skillDir);
      await fs.ensureDir(path.join(skillDir, 'scripts'));
      await fs.writeFile(path.join(skillDir, 'SKILL.md'), SKILL_MD);
      await fs.writeFile(path.join(skillDir, 'llms-reference.md'), LLMS_REF);
      await fs.writeFile(path.join(skillDir, 'api-reference.md'), API_REF);
      await fs.writeFile(path.join(skillDir, 'best-practices.md'), BEST_PRACTICES);
      await fs.writeFile(path.join(skillDir, 'scripts', 'sync-docs.py'), SYNC_PY);

      await fs.ensureDir(path.dirname(instrFile));
      await fs.writeFile(instrFile, INSTR_MD);

      console.log(chalk.green(`✅ Created supporting skill: .github/skills/convex-patterns and instruction: .github/instructions/convex-development.instructions.md`));
    }
  }

  // Offer to scaffold supporting skill + instruction for Coolify
  if (name === 'devops-coolify-specialist') {
    const resp3 = await prompts({
      type: 'confirm',
      name: 'scaffold',
      message: 'Scaffold supporting skill and instruction for Coolify (coolify-patterns + coolify-development)?',
      initial: true
    });

    if (resp3.scaffold) {
      const skillDir = path.join(githubDir, 'skills', 'coolify-patterns');
      const instrFile = path.join(githubDir, 'instructions', 'coolify-development.instructions.md');

      const SKILL_MD = `---\nname: coolify-patterns\ndescription: Coolify deployment patterns and best practices (self-hosted PaaS).\nversion: 1.0\nallowed-tools: ['read','search']\n---\n\n# Skill: Coolify Patterns\n\n> Quick reference for deploying and operating apps with Coolify.`;

      const LLMS_REF = `# Coolify — Quick Reference\n\nConcise patterns for using Coolify as a self-hosted app platform. Pull the full canonical guide from https://coolify.io/docs/llms.txt when needed.`;

      const API_REF = `# Coolify Deployments — Essentials\n\nExamples and notes for builds, stacks, and deployment pipelines.`;

      const BEST_PRACTICES = `# Coolify Best Practices\n\n- Use reproducible builds and pinned images\n- Secure secret management and RBAC\n- Automate backups and health checks`;

      const SYNC_PY = `#!/usr/bin/env python3\n\n"""Fetch Coolify llms.txt and save a local copy for offline reference."""\n\nimport sys\nfrom pathlib import Path\n\ntry:\n    import requests\nexcept ImportError:\n    print("requests package is required. Install with: pip install requests")\n    sys.exit(1)\n\nROOT = Path(__file__).resolve().parent.parent\nOUT_FILE = ROOT / "llms-source.txt"\nURLS = [\n    "https://coolify.io/docs/llms.txt"\n]\n\nif __name__ == "__main__":\n    combined = []\n    for u in URLS:\n        try:\n            r = requests.get(u, timeout=10)\n            r.raise_for_status()\n            combined.append(f"# Source: {u}\n\n" + r.text)\n        except Exception as e:\n            print(f"Failed to fetch {u}: {e}")\n\n    if not combined:\n        print("No content fetched.")\n        sys.exit(1)\n\n    OUT_FILE.write_text("\n\n".join(combined), encoding="utf-8")\n    print(f"Saved docs to {OUT_FILE}")`;

      const INSTR_MD = `---\nname: coolify-development\ndescription: Guidelines for deploying and operating apps using Coolify and related deployment artifacts.\nversion: 1.0\napplyTo: "**/coolify/**,**/deploy/**,**/Dockerfile,**/docker-compose.*"\n---\n\n## Coolify Development Guidelines\n\n> Short checklist for safe deployments using Coolify.`;

      await fs.ensureDir(skillDir);
      await fs.ensureDir(path.join(skillDir, 'scripts'));
      await fs.writeFile(path.join(skillDir, 'SKILL.md'), SKILL_MD);
      await fs.writeFile(path.join(skillDir, 'llms-reference.md'), LLMS_REF);
      await fs.writeFile(path.join(skillDir, 'api-reference.md'), API_REF);
      await fs.writeFile(path.join(skillDir, 'best-practices.md'), BEST_PRACTICES);
      await fs.writeFile(path.join(skillDir, 'scripts', 'sync-docs.py'), SYNC_PY);

      await fs.ensureDir(path.dirname(instrFile));
      await fs.writeFile(instrFile, INSTR_MD);

      console.log(chalk.green(`✅ Created supporting skill: .github/skills/coolify-patterns and instruction: .github/instructions/coolify-development.instructions.md`));
    }
  }
}

async function addSkill(githubDir, name, options) {
  const skillFile = path.join(githubDir, 'skills', name, 'SKILL.md');

  if (fs.existsSync(skillFile)) {
    console.log(chalk.yellow(`⚠️  Skill "${name}" already exists.`));
    return;
  }

  const response = await prompts([
    {
      type: 'text',
      name: 'description',
      message: 'Description (used for semantic loading):',
      initial: `${name} helper`
    }
  ]);

  if (!response.description) {
    console.log(chalk.yellow('Aborted.'));
    return;
  }

  const content = SKILL_TEMPLATE(name, response.description);

  await fs.ensureDir(path.dirname(skillFile));
  await fs.writeFile(skillFile, content);

  console.log(chalk.green(`✅ Created skill: .github/skills/${name}/SKILL.md`));
  console.log(chalk.dim(`   This skill will be loaded when you ask about "${response.description}"`));
}

async function addInstruction(githubDir, name, options) {
  const instrFile = path.join(githubDir, 'instructions', `${name}.instructions.md`);

  if (fs.existsSync(instrFile)) {
    console.log(chalk.yellow(`⚠️  Instruction "${name}" already exists.`));
    return;
  }

  const response = await prompts([
    {
      type: 'text',
      name: 'applyTo',
      message: 'Apply to files (glob pattern):',
      initial: `**/*.${name},**/${name}/**`
    },
    {
      type: 'text',
      name: 'description',
      message: 'Brief description:',
      initial: `${name} coding guidelines`
    }
  ]);

  if (!response.applyTo) {
    console.log(chalk.yellow('Aborted.'));
    return;
  }

  const content = `---
name: ${name}
description: ${response.description}
version: 1.0
applyTo: "${response.applyTo}"
---

## ${name.charAt(0).toUpperCase() + name.slice(1)} Guidelines

> ${response.description}

### Style
- Follow project conventions
- Consistent formatting
- Document public APIs

### Patterns
- Use established patterns
- Avoid anti-patterns
- Consider maintainability

### Best Practices
- [Add specific guidelines here]
`;

  await fs.ensureDir(path.dirname(instrFile));
  await fs.writeFile(instrFile, content);

  console.log(chalk.green(`✅ Created instruction: .github/instructions/${name}.instructions.md`));
  console.log(chalk.dim(`   Will apply to: ${response.applyTo}`));
}

export default addCommand;
