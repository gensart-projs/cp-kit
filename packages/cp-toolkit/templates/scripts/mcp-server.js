#!/usr/bin/env node

/**
 * Antigravity Agent Toolkit - MCP Server
 * 
 * Model Context Protocol server that exposes the Antigravity toolkit
 * capabilities to AI assistants like GitHub Copilot.
 * 
 * Features:
 * - List and load agents
 * - List and load skills
 * - Execute workflows (slash commands)
 * - Access shared context
 * 
 * @version 1.0.0
 * @license MIT
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import * as fs from 'fs/promises';
import * as path from 'path';

const AGENT_ROOT = process.env.AGENT_ROOT || path.join(process.cwd(), '.github');

// ============================================================================
// HELPERS
// ============================================================================

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readMarkdownFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    return null;
  }
}

async function listDirectory(dirPath) {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return entries;
  } catch {
    return [];
  }
}

function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  
  if (!match) return { frontmatter: {}, body: content };
  
  const frontmatterStr = match[1];
  const body = content.slice(match[0].length).trim();
  
  const frontmatter = {};
  for (const line of frontmatterStr.split('\n')) {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      frontmatter[key.trim()] = valueParts.join(':').trim();
    }
  }
  
  return { frontmatter, body };
}

// ============================================================================
// AGENT TOOLKIT FUNCTIONS
// ============================================================================

async function listAgents() {
  const agentsDir = path.join(AGENT_ROOT, 'agents');
  const entries = await listDirectory(agentsDir);
  
  const agents = [];
  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.md')) {
      const name = entry.name.replace('.md', '');
      const content = await readMarkdownFile(path.join(agentsDir, entry.name));
      const { frontmatter } = parseFrontmatter(content || '');
      
      agents.push({
        name,
        description: frontmatter.description || `${name} agent`,
        skills: frontmatter.skills || '',
        tools: frontmatter.tools || '',
      });
    }
  }
  
  return agents;
}

async function loadAgent(agentName) {
  const agentPath = path.join(AGENT_ROOT, 'agents', `${agentName}.md`);
  const content = await readMarkdownFile(agentPath);
  
  if (!content) {
    return { error: `Agent '${agentName}' not found` };
  }
  
  const { frontmatter, body } = parseFrontmatter(content);
  
  // Load associated skills
  const skills = [];
  if (frontmatter.skills) {
    const skillNames = frontmatter.skills.split(',').map(s => s.trim());
    for (const skillName of skillNames) {
      const skillContent = await loadSkill(skillName);
      if (!skillContent.error) {
        skills.push(skillContent);
      }
    }
  }
  
  return {
    name: agentName,
    frontmatter,
    instructions: body,
    skills,
  };
}

async function listSkills() {
  const skillsDir = path.join(AGENT_ROOT, 'skills');
  const skills = [];
  
  // Scan core skills
  const coreDir = path.join(skillsDir, 'core');
  const coreEntries = await listDirectory(coreDir);
  for (const entry of coreEntries) {
    if (entry.isDirectory()) {
      const skillPath = path.join(coreDir, entry.name, 'SKILL.md');
      const content = await readMarkdownFile(skillPath);
      
      if (content) {
        const { frontmatter } = parseFrontmatter(content);
        skills.push({
          name: entry.name,
          category: 'core',
          description: frontmatter.description || `${entry.name} skill`,
          version: frontmatter.version || '1.0.0',
        });
      }
    }
  }
  
  // Scan optional skills
  const optionalDir = path.join(skillsDir, 'optional');
  const optionalEntries = await listDirectory(optionalDir);
  for (const entry of optionalEntries) {
    if (entry.isDirectory()) {
      const skillPath = path.join(optionalDir, entry.name, 'SKILL.md');
      const content = await readMarkdownFile(skillPath);
      
      if (content) {
        const { frontmatter } = parseFrontmatter(content);
        skills.push({
          name: entry.name,
          category: 'optional',
          description: frontmatter.description || `${entry.name} skill`,
          version: frontmatter.version || '1.0.0',
        });
      }
    }
  }
  
  return skills;
}

async function loadSkill(skillName) {
  const skillsDir = path.join(AGENT_ROOT, 'skills');
  
  // Try core first, then optional
  let skillPath = path.join(skillsDir, 'core', skillName, 'SKILL.md');
  let category = 'core';
  
  if (!await fileExists(skillPath)) {
    skillPath = path.join(skillsDir, 'optional', skillName, 'SKILL.md');
    category = 'optional';
  }
  
  const content = await readMarkdownFile(skillPath);
  
  if (!content) {
    return { error: `Skill '${skillName}' not found in core/ or optional/` };
  }
  
  const { frontmatter, body } = parseFrontmatter(content);
  const skillDir = path.dirname(skillPath);
  
  // Check for references
  const referencesDir = path.join(skillDir, 'references');
  const references = [];
  if (await fileExists(referencesDir)) {
    const refEntries = await listDirectory(referencesDir);
    for (const ref of refEntries) {
      if (ref.isFile()) {
        references.push(ref.name);
      }
    }
  }
  
  // Check for scripts
  const scriptsDir = path.join(skillDir, 'scripts');
  const scripts = [];
  if (await fileExists(scriptsDir)) {
    const scriptEntries = await listDirectory(scriptsDir);
    for (const script of scriptEntries) {
      if (script.isFile()) {
        scripts.push(script.name);
      }
    }
  }
  
  return {
    name: skillName,
    category,
    frontmatter,
    instructions: body,
    references,
    scripts,
  };
}

async function listWorkflows() {
  const workflowsDir = path.join(AGENT_ROOT, 'workflows');
  const entries = await listDirectory(workflowsDir);
  
  const workflows = [];
  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.md')) {
      const name = entry.name.replace('.md', '');
      const content = await readMarkdownFile(path.join(workflowsDir, entry.name));
      const { frontmatter } = parseFrontmatter(content || '');
      
      workflows.push({
        command: `/${name}`,
        name,
        description: frontmatter.description || `${name} workflow`,
      });
    }
  }
  
  return workflows;
}

async function loadWorkflow(workflowName) {
  const cleanName = workflowName.replace(/^\//, '');
  const workflowPath = path.join(AGENT_ROOT, 'workflows', `${cleanName}.md`);
  const content = await readMarkdownFile(workflowPath);
  
  if (!content) {
    return { error: `Workflow '${workflowName}' not found` };
  }
  
  const { frontmatter, body } = parseFrontmatter(content);
  
  return {
    command: `/${cleanName}`,
    name: cleanName,
    frontmatter,
    instructions: body,
  };
}

async function loadRules() {
  const rulesPath = path.join(AGENT_ROOT, 'rules', 'GEMINI.md');
  const content = await readMarkdownFile(rulesPath);
  
  if (!content) {
    return { error: 'Base rules not found' };
  }
  
  const { frontmatter, body } = parseFrontmatter(content);
  
  return {
    name: 'GEMINI',
    trigger: frontmatter.trigger || 'always_on',
    instructions: body,
  };
}

async function routeToAgent(request) {
  // Keywords to agent mapping
  const routingMatrix = {
    // Frontend
    'react|next|component|ui|css|tailwind|frontend|layout|style': 'frontend-specialist',
    // Backend
    'api|endpoint|route|express|node|backend|server': 'backend-specialist',
    // Database
    'database|schema|migration|prisma|sql|query|table': 'database-architect',
    // Security
    'security|auth|login|password|vulnerability|owasp': 'security-auditor',
    // Testing
    'test|coverage|unit|e2e|jest|playwright': 'test-engineer',
    // Debug
    'error|bug|fix|broken|not working|debug': 'debugger',
    // DevOps
    'deploy|docker|ci|cd|kubernetes|pipeline': 'devops-engineer',
    // Mobile
    'mobile|ios|android|react native|flutter|app': 'mobile-developer',
    // Performance
    'slow|optimize|performance|speed|lighthouse': 'performance-optimizer',
  };
  
  const lowerRequest = request.toLowerCase();
  
  for (const [keywords, agent] of Object.entries(routingMatrix)) {
    const regex = new RegExp(keywords, 'i');
    if (regex.test(lowerRequest)) {
      return agent;
    }
  }
  
  // Default to orchestrator for complex/unclear requests
  return 'orchestrator';
}

// ============================================================================
// MCP SERVER SETUP
// ============================================================================

const server = new Server(
  {
    name: 'antigravity-agent-toolkit',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  }
);

// ============================================================================
// TOOLS
// ============================================================================

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_agents',
        description: 'List all available specialist agents in the Antigravity toolkit',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'load_agent',
        description: 'Load a specific agent with its instructions and skills',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Agent name (e.g., frontend-specialist, backend-specialist)',
            },
          },
          required: ['name'],
        },
      },
      {
        name: 'list_skills',
        description: 'List all available skills in the Antigravity toolkit',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'load_skill',
        description: 'Load a specific skill with its instructions',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Skill name (e.g., clean-code, testing-patterns)',
            },
          },
          required: ['name'],
        },
      },
      {
        name: 'list_workflows',
        description: 'List all available slash command workflows',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'execute_workflow',
        description: 'Load and execute a slash command workflow',
        inputSchema: {
          type: 'object',
          properties: {
            command: {
              type: 'string',
              description: 'Workflow command (e.g., /plan, /debug, /create)',
            },
          },
          required: ['command'],
        },
      },
      {
        name: 'route_request',
        description: 'Automatically route a user request to the best agent',
        inputSchema: {
          type: 'object',
          properties: {
            request: {
              type: 'string',
              description: 'The user request to analyze and route',
            },
          },
          required: ['request'],
        },
      },
      {
        name: 'load_rules',
        description: 'Load the base rules (GEMINI.md) for the toolkit',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    switch (name) {
      case 'list_agents': {
        const agents = await listAgents();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(agents, null, 2),
            },
          ],
        };
      }
      
      case 'load_agent': {
        const agent = await loadAgent(args.name);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(agent, null, 2),
            },
          ],
        };
      }
      
      case 'list_skills': {
        const skills = await listSkills();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(skills, null, 2),
            },
          ],
        };
      }
      
      case 'load_skill': {
        const skill = await loadSkill(args.name);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(skill, null, 2),
            },
          ],
        };
      }
      
      case 'list_workflows': {
        const workflows = await listWorkflows();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(workflows, null, 2),
            },
          ],
        };
      }
      
      case 'execute_workflow': {
        const workflow = await loadWorkflow(args.command);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(workflow, null, 2),
            },
          ],
        };
      }
      
      case 'route_request': {
        const agentName = await routeToAgent(args.request);
        const agent = await loadAgent(agentName);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                selectedAgent: agentName,
                reason: `Request matched keywords for ${agentName}`,
                agent,
              }, null, 2),
            },
          ],
        };
      }
      
      case 'load_rules': {
        const rules = await loadRules();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(rules, null, 2),
            },
          ],
        };
      }
      
      default:
        return {
          content: [
            {
              type: 'text',
              text: `Unknown tool: ${name}`,
            },
          ],
          isError: true,
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// ============================================================================
// RESOURCES
// ============================================================================

server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'antigravity://architecture',
        name: 'Toolkit Architecture',
        description: 'Complete architecture documentation for the Antigravity toolkit',
        mimeType: 'text/markdown',
      },
      {
        uri: 'antigravity://rules',
        name: 'Base Rules',
        description: 'GEMINI.md base rules (always active)',
        mimeType: 'text/markdown',
      },
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  
  switch (uri) {
    case 'antigravity://architecture': {
      const content = await readMarkdownFile(path.join(AGENT_ROOT, 'ARCHITECTURE.md'));
      return {
        contents: [
          {
            uri,
            mimeType: 'text/markdown',
            text: content || 'Architecture file not found',
          },
        ],
      };
    }
    
    case 'antigravity://rules': {
      const rules = await loadRules();
      return {
        contents: [
          {
            uri,
            mimeType: 'text/markdown',
            text: rules.instructions || 'Rules file not found',
          },
        ],
      };
    }
    
    default:
      throw new Error(`Unknown resource: ${uri}`);
  }
});

// ============================================================================
// PROMPTS (Slash Commands as MCP Prompts)
// ============================================================================

server.setRequestHandler(ListPromptsRequestSchema, async () => {
  const workflows = await listWorkflows();
  
  return {
    prompts: workflows.map((w) => ({
      name: w.name,
      description: w.description,
      arguments: [
        {
          name: 'context',
          description: 'Additional context for the workflow',
          required: false,
        },
      ],
    })),
  };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  const workflow = await loadWorkflow(name);
  
  if (workflow.error) {
    throw new Error(workflow.error);
  }
  
  const contextNote = args?.context ? `\n\nUser Context: ${args.context}` : '';
  
  return {
    description: workflow.frontmatter?.description || `Execute ${name} workflow`,
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `Execute the /${name} workflow.\n\n${workflow.instructions}${contextNote}`,
        },
      },
    ],
  };
});

// ============================================================================
// START SERVER
// ============================================================================

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Antigravity Agent Toolkit MCP Server running');
}

main().catch(console.error);
