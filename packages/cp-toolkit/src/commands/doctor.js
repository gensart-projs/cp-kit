/**
 * cp-toolkit doctor command
 * 
 * Diagnose cp-toolkit configuration and suggest fixes.
 */

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

const CHECKS = [
  {
    name: '.github/ directory exists',
    check: async (dir) => fs.pathExists(path.join(dir, '.github')),
    fix: 'Run: cp-toolkit init'
  },
  {
    name: 'copilot-instructions.md exists',
    check: async (dir) => fs.pathExists(path.join(dir, '.github', 'copilot-instructions.md')),
    fix: 'Run: cp-toolkit init'
  },
  {
    name: 'agents/ directory exists',
    check: async (dir) => fs.pathExists(path.join(dir, '.github', 'agents')),
    fix: 'Run: cp-toolkit init'
  },
  {
    name: 'At least one agent defined',
    check: async (dir) => {
      const agentsDir = path.join(dir, '.github', 'agents');
      if (!await fs.pathExists(agentsDir)) return false;
      const files = await fs.readdir(agentsDir);
      return files.some(f => f.endsWith('.agent.md') || f.endsWith('.md'));
    },
    fix: 'Run: cp-toolkit add agent <name>'
  },
  {
    name: 'skills/ directory exists',
    check: async (dir) => fs.pathExists(path.join(dir, '.github', 'skills')),
    fix: 'Run: cp-toolkit init'
  },
  {
    name: 'instructions/ directory exists',
    check: async (dir) => fs.pathExists(path.join(dir, '.github', 'instructions')),
    fix: 'Run: cp-toolkit init'
  },
  {
    name: 'At least one instruction defined',
    check: async (dir) => {
      const instrDir = path.join(dir, '.github', 'instructions');
      if (!await fs.pathExists(instrDir)) return false;
      const files = await fs.readdir(instrDir);
      return files.some(f => f.endsWith('.instructions.md'));
    },
    fix: 'Run: cp-toolkit add instruction <name>'
  },
  {
    name: 'AGENTS.md exists at root',
    check: async (dir) => fs.pathExists(path.join(dir, 'AGENTS.md')),
    fix: 'Run: cp-toolkit init'
  },
  {
    name: '.vscode/mcp.json exists',
    check: async (dir) => fs.pathExists(path.join(dir, '.vscode', 'mcp.json')),
    optional: true,
    fix: 'Run: cp-toolkit init (with MCP option)'
  },
  {
    name: 'Instructions have valid frontmatter (applyTo, version)',
    check: async (dir) => {
      const instrDir = path.join(dir, '.github', 'instructions');
      if (!await fs.pathExists(instrDir)) return true;
      const files = await fs.readdir(instrDir);
      for (const file of files.filter(f => f.endsWith('.instructions.md'))) {
        const content = await fs.readFile(path.join(instrDir, file), 'utf-8');
        if (!content.includes('applyTo:')) return false;
        if (!content.includes('version:')) return false;
        if (!content.includes('description:')) return false;
      }
      return true;
    },
    fix: 'Add version and description frontmatter to instruction files'
  },
  {
    name: 'Agents have complete frontmatter (name, description, capabilities)',
    check: async (dir) => {
      const agentsDir = path.join(dir, '.github', 'agents');
      if (!await fs.pathExists(agentsDir)) return true;
      const files = await fs.readdir(agentsDir);
      for (const file of files.filter(f => f.endsWith('.agent.md'))) {
        const content = await fs.readFile(path.join(agentsDir, file), 'utf-8');
        if (!content.startsWith('---')) return false;
        if (!content.includes('name:')) return false;
        if (!content.includes('description:')) return false;
        // Capabilities is the new standard (was skills)
        if (!content.includes('capabilities:') && !content.includes('tools:')) return false; 
      }
      return true;
    },
    fix: 'Update agent files with full frontmatter (name, description, capabilities, model)'
  }
];

export async function doctorCommand() {
  const targetDir = process.cwd();

  console.log('');
  console.log(chalk.bold.cyan('🩺 cp-toolkit Doctor'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.gray(`Checking: ${targetDir}`));
  console.log('');

  let passed = 0;
  let failed = 0;
  let warnings = 0;

  for (const check of CHECKS) {
    try {
      const result = await check.check(targetDir);

      if (result) {
        console.log(chalk.green('  ✓ ') + check.name);
        passed++;
      } else if (check.optional) {
        console.log(chalk.yellow('  ⚠ ') + check.name + chalk.gray(' (optional)'));
        warnings++;
      } else {
        console.log(chalk.red('  ✗ ') + check.name);
        if (check.fix) {
          console.log(chalk.gray('    ' + check.fix));
        }
        failed++;
      }
    } catch (error) {
      console.log(chalk.red('  ✗ ') + check.name + chalk.gray(` (${error.message})`));
      failed++;
    }
  }

  console.log('');
  console.log(chalk.gray('─'.repeat(50)));

  if (failed === 0) {
    if (warnings > 0) {
      console.log(chalk.green.bold(`✓ All checks passed!`) + chalk.gray(` (${passed} passed, ${warnings} optional)`));
    } else {
      console.log(chalk.green.bold(`✓ All checks passed! (${passed}/${passed})`));
    }
    console.log('');
    console.log(chalk.green('✨ cp-toolkit is healthy!'));
  } else {
    console.log(chalk.red.bold(`✗ ${failed} checks failed`) + chalk.gray(` (${passed} passed, ${warnings} optional)`));
    console.log('');
    console.log(chalk.yellow('Run suggested fixes above.'));
  }
  console.log('');
}

export default doctorCommand;
