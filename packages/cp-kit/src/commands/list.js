/**
 * cp-kit list command
 * 
 * List available agents and instructions.
 */

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

export async function listCommand(type) {
  const targetDir = process.cwd();
  const githubDir = path.join(targetDir, '.github');
  
  // Check if cp-kit is initialized
  if (!fs.existsSync(path.join(githubDir, 'copilot-instructions.md'))) {
    console.log(chalk.red('❌ cp-kit not initialized.'));
    console.log(chalk.dim('   Run: cp-kit init'));
    return;
  }
  
  const validTypes = ['agents', 'instructions', 'all'];
  if (!validTypes.includes(type)) {
    console.log(chalk.red(`❌ Unknown type: ${type}`));
    console.log(chalk.dim(`   Valid types: ${validTypes.join(', ')}`));
    return;
  }
  
  console.log('');
  
  if (type === 'all' || type === 'agents') {
    await listAgents(githubDir);
  }
  
  if (type === 'all' || type === 'instructions') {
    await listInstructions(githubDir);
  }
}

async function listAgents(githubDir) {
  const agentsDir = path.join(githubDir, 'agents');
  
  console.log(chalk.bold.cyan('🤖 Agents'));
  console.log(chalk.gray('─'.repeat(50)));
  
  if (!fs.existsSync(agentsDir)) {
    console.log(chalk.gray('  No agents found'));
    console.log('');
    return;
  }
  
  const files = await fs.readdir(agentsDir);
  const agents = files.filter(f => f.endsWith('.md'));
  
  if (agents.length === 0) {
    console.log(chalk.gray('  No agents found'));
    console.log('');
    return;
  }
  
  for (const file of agents) {
    const name = file.replace('.md', '');
    const content = await fs.readFile(path.join(agentsDir, file), 'utf-8');
    const desc = extractFrontmatter(content, 'description') || '';
    
    console.log(`  ${chalk.green('@' + name)}`);
    if (desc) {
      console.log(`  ${chalk.gray(desc)}`);
    }
    console.log('');
  }
  
  console.log(chalk.gray(`  Total: ${agents.length} agents`));
  console.log('');
}

async function listInstructions(githubDir) {
  const instrDir = path.join(githubDir, 'instructions');
  
  console.log(chalk.bold.cyan('📋 Instructions'));
  console.log(chalk.gray('─'.repeat(50)));
  
  if (!fs.existsSync(instrDir)) {
    console.log(chalk.gray('  No instructions found'));
    console.log('');
    return;
  }
  
  const files = await fs.readdir(instrDir);
  const instructions = files.filter(f => f.endsWith('.instructions.md'));
  
  if (instructions.length === 0) {
    console.log(chalk.gray('  No instructions found'));
    console.log('');
    return;
  }
  
  for (const file of instructions) {
    const name = file.replace('.instructions.md', '');
    const content = await fs.readFile(path.join(instrDir, file), 'utf-8');
    const applyTo = extractFrontmatter(content, 'applyTo') || '*';
    
    console.log(`  ${chalk.yellow(name)}`);
    console.log(`  ${chalk.gray('→ ' + applyTo)}`);
    console.log('');
  }
  
  console.log(chalk.gray(`  Total: ${instructions.length} instructions`));
  console.log('');
}

function extractFrontmatter(content, key) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  
  if (!match) return null;
  
  const lines = match[1].split('\n');
  for (const line of lines) {
    if (line.startsWith(`${key}:`)) {
      return line.slice(key.length + 1).trim().replace(/^["']|["']$/g, '');
    }
  }
  
  return null;
}

export default listCommand;
