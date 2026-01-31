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
import os from 'os';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getGlobalPromptsDir() {
  const platform = os.platform();
  const homeDir = os.homedir();
  
  if (platform === 'win32') {
    return path.join(process.env.APPDATA, 'Code', 'User', 'prompts');
  } else if (platform === 'darwin') {
    return path.join(homeDir, 'Library', 'Application Support', 'Code', 'User', 'prompts');
  } else {
    // Linux and others
    return path.join(homeDir, '.config', 'Code', 'User', 'prompts');
  }
}

async function initGlobal(options, templatesDir) {
  const targetDir = getGlobalPromptsDir();
  console.log(chalk.bold.cyan('\n🌍 cp-toolkit - Installing Global Instructions\n'));
  console.log(chalk.dim(`Target directory: ${targetDir}`));

  if (!options.yes) {
     const { confirm } = await prompts({
      type: 'confirm',
      name: 'confirm',
      message: `Install instructions globally to VS Code User Data?`,
      initial: true
    });
    if (!confirm) return;
  }

  const spinner = ora('Installing global instructions...').start();
  
  try {
    // Check if Code/User exists (VS Code installed?)
    if (!fs.existsSync(path.dirname(targetDir))) {
      spinner.warn(chalk.yellow('VS Code User directory not found. Is VS Code installed?'));
      const { create } = await prompts({
        type: 'confirm',
        name: 'create',
        message: 'Create directory anyway?',
        initial: true
      });
      if (!create) return;
    }

    await fs.ensureDir(targetDir);

    // Copy instructions
    // We flatten them: templates/instructions/*.md -> targetDir/*.md
    const instructionsSourceDir = path.join(templatesDir, 'instructions');
    const files = await fs.readdir(instructionsSourceDir);
    
    let count = 0;
    for (const file of files) {
      if (file.endsWith('.md')) {
        await fs.copy(
          path.join(instructionsSourceDir, file),
          path.join(targetDir, file),
          { overwrite: options.force }
        );
        count++;
      }
    }

    spinner.succeed(chalk.green(`✨ Installed ${count} global instruction files!`));
    console.log(chalk.bold('\n🚀 Next Steps:'));
    console.log(`   1. Instructions are now available in ${chalk.cyan('ALL')} your projects.`);
    console.log(`   2. Use ${chalk.yellow('Settings Sync')} in VS Code to sync them across machines.`);
    
  } catch (error) {
    spinner.fail(chalk.red('❌ Failed to install global instructions'));
    console.error(error);
  }
}

export async function initCommand(directory, options) {
  const templatesDir = path.join(__dirname, '../../templates');

  if (options.global) {
    return initGlobal(options, templatesDir);
  }

  const targetDir = directory ? path.resolve(directory) : process.cwd();
  const dirName = path.basename(targetDir);

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

    // 2. Setup .github/instructions/
    spinner.text = 'Copying instructions...';
    const instructionsSourceDir = path.join(templatesDir, 'instructions');
    const instructionsTargetDir = path.join(targetDir, '.github', 'instructions');
    await fs.ensureDir(instructionsTargetDir);
    await fs.copy(instructionsSourceDir, instructionsTargetDir, { overwrite: true });

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
      'architecture',
      'brainstorming',
      'clean-code',
      'plan-writing'
    ];

    for (const skill of essentialSkills) {
      const skillSourceDir = path.join(templatesDir, 'skills', skill);
      if (fs.existsSync(skillSourceDir)) {
        const skillTargetDir = path.join(skillsTargetDir, skill);
        await fs.ensureDir(skillTargetDir);
        await fs.copy(skillSourceDir, skillTargetDir, { overwrite: true });
      }
    }

    // 5. Setup .github/copilot-instructions.md
    spinner.text = 'Creating copilot-instructions.md...';
    const instructionsPath = path.join(targetDir, '.github', 'copilot-instructions.md');
    const instructionsTemplatePath = path.join(templatesDir, 'copilot-instructions.md');
    await fs.copy(instructionsTemplatePath, instructionsPath);

    // 6. Setup .github/cp-kit-models.yaml
    spinner.text = 'Creating cp-kit-models.yaml...';
    const modelsPath = path.join(targetDir, '.github', 'cp-kit-models.yaml');
    const modelsTemplatePath = path.join(templatesDir, 'cp-kit-models.yaml');
    await fs.copy(modelsTemplatePath, modelsPath);

    // 7. Setup .vscode/settings.json
    spinner.text = 'Configuring VS Code settings...';
    const vscodeDir = path.join(targetDir, '.vscode');
    await fs.ensureDir(vscodeDir);
    
    const settingsPath = path.join(vscodeDir, 'settings.json');
    let settings = {};
    if (fs.existsSync(settingsPath)) {
      try {
        settings = JSON.parse(await fs.readFile(settingsPath, 'utf8'));
      } catch (e) {
        // ignore error
      }
    }

    settings['chat.agent.skills.enabled'] = true;
    // Suggest other useful settings for 2026
    settings['github.copilot.chat.welcomeMessage'] = "always";

    await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2));

    // 8. Setup .vscode/mcp.json
    spinner.text = 'Configuring MCP Server...';

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

    // 9. Copy workflows to .github/workflows-copilot/ (optional reference)
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

export default initCommand;
