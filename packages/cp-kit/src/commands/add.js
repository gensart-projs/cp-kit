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

export async function addCommand(type, name, options) {
  const targetDir = process.cwd();
  
  // Validate type
  const validTypes = ['agent', 'instruction'];
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
    case 'instruction':
      await addInstruction(githubDir, name, options);
      break;
  }
}

async function addAgent(githubDir, name, options) {
  const agentFile = path.join(githubDir, 'agents', `${name}.md`);
  
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
  
  console.log(chalk.green(`✅ Created agent: .github/agents/${name}.md`));
  console.log(chalk.dim(`   Invoke with @${name} in Copilot Chat`));
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
