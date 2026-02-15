#!/usr/bin/env node

/**
 * cp-toolkit - GitHub Copilot Agent Toolkit
 * 
 * Initialize and manage AI agents for GitHub Copilot.
 * 
 * Usage:
 *   npx cp-toolkit init                # Initialize in current directory
 *   npx cp-toolkit init my-project     # Initialize in new directory
 *   cp-toolkit add agent <name>        # Add a new agent
 *   cp-toolkit add instruction <name>  # Add a new instruction
 *   cp-toolkit list agents             # List available agents
 *   cp-toolkit list instructions       # List available instructions
 *   cp-toolkit doctor                  # Check configuration
 * 
 * @version 1.0.0
 * @license MIT
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { initCommand } from '../src/commands/init.js';
import { addCommand } from '../src/commands/add.js';
import { listCommand } from '../src/commands/list.js';
import { doctorCommand } from '../src/commands/doctor.js';

// Get version from package.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));

const program = new Command();

program
  .name('cp-toolkit')
  .description('GitHub Copilot Agent Toolkit - Initialize AI agents for your project')
  .version(packageJson.version);

// cp-toolkit init [directory]
program
  .command('init [directory]')
  .description('Initialize cp-toolkit in a directory (creates .github/ structure)')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .option('-f, --force', 'Overwrite existing configuration')
  .option('-g, --global', 'Install instructions globally to VS Code User Prompts directory')
  .action(initCommand);

// cp-toolkit add <type> <name>
program
  .command('add <type> <name>')
  .description('Add a new agent or instruction')
  .option('-t, --template <template>', 'Use a specific template')
  .action(addCommand);

// cp-toolkit list [type]
program
  .command('list [type]')
  .description('List available agents or instructions')
  .action((type = 'all') => listCommand(type));

// cp-toolkit doctor
program
  .command('doctor')
  .description('Check cp-toolkit configuration and diagnose issues')
  .action(doctorCommand);

// Show help if no command provided
if (process.argv.length === 2) {
  console.log('');
  console.log(chalk.bold.cyan('  🤖 cp-toolkit - GitHub Copilot Agent Toolkit'));
  console.log('');
  console.log(chalk.gray('  Initialize AI agents and instructions for GitHub Copilot'));
  console.log('');
  program.outputHelp();
}

program.parse();
