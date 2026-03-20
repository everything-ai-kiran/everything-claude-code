#!/usr/bin/env node

/**
 * Convert agents from Claude format to Copilot format
 * 
 * Usage: node scripts/convert-agents-to-copilot.js
 * 
 * Reads: /agents/*.md (Claude format)
 * Writes: .github/agents/*.agent.md (Copilot format)
 */

const fs = require('fs');
const path = require('path');

// Tool mapping from Claude to Copilot
const TOOL_MAP = {
  'Read': 'vscode/read',
  'Write': 'vscode/edit',
  'Edit': 'vscode/edit',
  'Search': 'vscode/search',
  'Grep': 'vscode/grep',
  'Glob': 'vscode/search',
  'Bash': 'vscode/terminal',
  'Terminal': 'vscode/terminal',
  'Problems': 'vscode/problems',
  'Browser': 'vscode/browser',
  // Custom/MCP tools - keep as-is
  'GitHub': 'github',
  'Playwright': 'playwright',
  'PostgreSQL': 'postgres',
  'Database': 'postgres',
};

// Model mapping from Claude shorthand to full names
const MODEL_MAP = {
  'opus': 'claude-opus',
  'sonnet': 'claude-sonnet',
  'haiku': 'claude-haiku',
  'gpt-4': 'gpt-4-turbo',
  'gpt-4-turbo': 'gpt-4-turbo',
  'mixtral': 'mixtral',
};

/**
 * Convert tool name from Claude to Copilot
 */
function convertTool(tool) {
  return TOOL_MAP[tool] || tool;
}

/**
 * Convert model name from Claude shorthand to full name
 */
function convertModel(model) {
  if (Array.isArray(model)) {
    return model.map(m => MODEL_MAP[m] || m);
  }
  return MODEL_MAP[model] || model;
}

/**
 * Simple YAML frontmatter parser
 */
function parseYAML(yamlStr) {
  const obj = {};
  const lines = yamlStr.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) {
      i++;
      continue;
    }

    // Parse key: value
    const match = line.match(/^([^:]+):\s*(.*)$/);
    if (!match) {
      i++;
      continue;
    }

    const [, key, value] = match;
    const trimmedKey = key.trim();
    let trimmedValue = value.trim();

    // Handle arrays - clean up quotes
    if (trimmedValue.startsWith('[')) {
      // Array notation: [item1, item2] or ["item1", "item2"]
      trimmedValue = trimmedValue
        .replace(/[\[\]]/g, '')
        .split(',')
        .map(v => v.trim().replace(/^["']|["']$/g, '')); // Remove surrounding quotes
    } else if (trimmedValue.startsWith('"') && trimmedValue.endsWith('"')) {
      trimmedValue = trimmedValue.slice(1, -1);
    }

    obj[trimmedKey] = trimmedValue;
    i++;
  }

  return obj;
}

/**
 * Format object as YAML
 */
function formatYAML(obj) {
  const lines = [];
  
  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      // Format arrays as YAML arrays
      const items = value.map(v => `'${v}'`).join(', ');
      lines.push(`${key}: [${items}]`);
    } else if (typeof value === 'string') {
      // Quote strings if they contain special characters
      if (value.includes(':') || value.includes('#') || value.includes('"')) {
        lines.push(`${key}: "${value.replace(/"/g, '\\"')}"`);
      } else {
        lines.push(`${key}: ${value}`);
      }
    } else {
      lines.push(`${key}: ${value}`);
    }
  }

  return lines.join('\n');
}

/**
 * Convert agent from Claude to Copilot format
 */
function convertAgent(agent) {
  const { frontmatter, body } = agent;

  // Convert tools array
  let tools = frontmatter.tools || [];
  if (typeof tools === 'string') {
    tools = tools.split(',').map(t => t.trim());
  }
  tools = tools.map(convertTool);

  // Convert model
  let model = frontmatter.model || 'claude-opus';
  model = convertModel(model);

  // Build new frontmatter
  const newFrontmatter = {
    name: frontmatter.name,
    description: frontmatter.description,
    tools: tools,
    model: Array.isArray(model) ? model : [model],
    'user-invocable': true,
  };

  // If there are additional fields, preserve them
  for (const [key, value] of Object.entries(frontmatter)) {
    if (!['name', 'description', 'tools', 'model'].includes(key)) {
      newFrontmatter[key] = value;
    }
  }

  return { frontmatter: newFrontmatter, body };
}

/**
 * Parse markdown file with YAML frontmatter
 */
function parseAgent(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    throw new Error('Invalid agent format: missing YAML frontmatter');
  }

  const frontmatter = parseYAML(match[1]);
  const body = match[2];

  return { frontmatter, body };
}

/**
 * Format agent as markdown with YAML frontmatter
 */
function formatAgent(agent) {
  const { frontmatter, body } = agent;
  const fm = formatYAML(frontmatter);

  return `---\n${fm}\n---\n${body}`;
}

/**
 * Main conversion function
 */
async function main() {
  const sourceDir = path.join(__dirname, '../agents');
  const targetDir = path.join(__dirname, '../.github/agents');

  // Create target directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Get all agent files
  const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.md'));

  console.log(`Found ${files.length} agents to convert...\n`);

  const results = {
    success: [],
    error: [],
  };

  for (const file of files) {
    try {
      const sourcePath = path.join(sourceDir, file);
      const targetPath = path.join(targetDir, file.replace('.md', '.agent.md'));

      // Read source file
      const content = fs.readFileSync(sourcePath, 'utf-8');

      // Parse and convert
      const agent = parseAgent(content);
      const converted = convertAgent(agent);
      const formatted = formatAgent(converted);

      // Write target file
      fs.writeFileSync(targetPath, formatted, 'utf-8');

      results.success.push({
        source: file,
        target: path.basename(targetPath),
        tools: converted.frontmatter.tools,
        model: converted.frontmatter.model,
      });

      console.log(`✅ ${file} → ${path.basename(targetPath)}`);
    } catch (error) {
      results.error.push({
        file,
        error: error.message,
      });

      console.log(`❌ ${file}: ${error.message}`);
    }
  }

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Conversion Summary`);
  console.log(`${'='.repeat(60)}`);
  console.log(`✅ Success: ${results.success.length}/${files.length}`);
  console.log(`❌ Errors:  ${results.error.length}/${files.length}\n`);

  if (results.error.length > 0) {
    console.log('Errors:');
    results.error.forEach(({ file, error }) => {
      console.log(`  - ${file}: ${error}`);
    });
    console.log();
  }

  // Tool usage summary
  console.log('Tool Conversions Applied:');
  const usedTools = new Set();
  results.success.forEach(result => {
    result.tools.forEach(t => usedTools.add(t));
  });
  Array.from(usedTools).sort().forEach(tool => {
    console.log(`  - ${tool}`);
  });

  console.log(`\nConverted agents written to: ${targetDir}`);
  console.log('Next steps:');
  console.log('1. Review converted agents for tool/model accuracy');
  console.log('2. Test agents in VS Code Copilot Chat');
  console.log('3. Adjust any tool mappings as needed');
  console.log('4. Commit changes: git add .github/agents/');
}

main().catch(error => {
  console.error('Conversion failed:', error);
  process.exit(1);
});
