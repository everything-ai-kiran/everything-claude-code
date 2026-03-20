#!/usr/bin/env node
/**
 * Validate Copilot migration assets for parity and schema basics.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '../..');
const SOURCE = {
  agents: path.join(ROOT, 'agents'),
  commands: path.join(ROOT, 'commands'),
  skills: path.join(ROOT, 'skills'),
};

const COPILOT = {
  agents: path.join(ROOT, '.github/agents'),
  prompts: path.join(ROOT, '.github/prompts'),
  skills: path.join(ROOT, '.github/skills'),
  hooks: path.join(ROOT, '.github/hooks/copilot-hooks.json'),
  instructions: path.join(ROOT, '.github/copilot-instructions.md'),
};

function listFiles(dir, suffix) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith(suffix));
}

function listDirs(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(name => {
    try {
      return fs.statSync(path.join(dir, name)).isDirectory();
    } catch {
      return false;
    }
  });
}

function extractFrontmatter(content) {
  const clean = content.replace(/^\uFEFF/, '');
  const match = clean.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const obj = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx > 0) {
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      obj[key] = value;
    }
  }
  return obj;
}

function toSet(arr) {
  return new Set(arr);
}

function diffSet(a, b) {
  const out = [];
  for (const item of a) {
    if (!b.has(item)) out.push(item);
  }
  return out;
}

function validate() {
  let hasErrors = false;

  const sourceAgents = listFiles(SOURCE.agents, '.md').map(f => f.replace(/\.md$/, ''));
  const copilotAgents = listFiles(COPILOT.agents, '.agent.md').map(f => f.replace(/\.agent\.md$/, ''));
  const sourceCommands = listFiles(SOURCE.commands, '.md').map(f => f.replace(/\.md$/, ''));
  const copilotPrompts = listFiles(COPILOT.prompts, '.prompt.md').map(f => f.replace(/\.prompt\.md$/, ''));
  const sourceSkills = listDirs(SOURCE.skills);
  const copilotSkills = listDirs(COPILOT.skills);

  const missingAgents = diffSet(toSet(sourceAgents), toSet(copilotAgents));
  const missingPrompts = diffSet(toSet(sourceCommands), toSet(copilotPrompts));
  const missingSkills = diffSet(toSet(sourceSkills), toSet(copilotSkills));

  if (missingAgents.length > 0) {
    hasErrors = true;
    console.error('ERROR: Missing Copilot agents:', missingAgents.join(', '));
  }
  if (missingPrompts.length > 0) {
    hasErrors = true;
    console.error('ERROR: Missing Copilot prompts:', missingPrompts.join(', '));
  }
  if (missingSkills.length > 0) {
    hasErrors = true;
    console.error('ERROR: Missing Copilot skills:', missingSkills.join(', '));
  }

  for (const file of listFiles(COPILOT.agents, '.agent.md')) {
    const full = path.join(COPILOT.agents, file);
    const content = fs.readFileSync(full, 'utf-8');
    const fm = extractFrontmatter(content);
    if (!fm) {
      console.error(`ERROR: ${file} missing frontmatter`);
      hasErrors = true;
      continue;
    }
    for (const field of ['name', 'description', 'tools', 'model']) {
      if (!fm[field] || !fm[field].trim()) {
        console.error(`ERROR: ${file} missing required field: ${field}`);
        hasErrors = true;
      }
    }
  }

  for (const file of listFiles(COPILOT.prompts, '.prompt.md')) {
    const full = path.join(COPILOT.prompts, file);
    const content = fs.readFileSync(full, 'utf-8');
    const fm = extractFrontmatter(content);
    if (!fm) {
      console.error(`ERROR: ${file} missing frontmatter`);
      hasErrors = true;
      continue;
    }
    if (!fm.description || !fm.description.trim()) {
      console.error(`ERROR: ${file} missing required field: description`);
      hasErrors = true;
    }
  }

  for (const jsonFile of [
    path.join(ROOT, '.vscode/settings.json'),
    path.join(ROOT, '.vscode/mcp.json'),
    COPILOT.hooks,
  ]) {
    if (!fs.existsSync(jsonFile)) {
      console.warn(`WARN: optional file not found: ${path.relative(ROOT, jsonFile)}`);
      continue;
    }
    try {
      JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
    } catch (error) {
      console.error(`ERROR: invalid JSON in ${path.relative(ROOT, jsonFile)}: ${error.message}`);
      hasErrors = true;
    }
  }

  if (!fs.existsSync(COPILOT.instructions)) {
    console.error('ERROR: Missing .github/copilot-instructions.md');
    hasErrors = true;
  }

  if (hasErrors) process.exit(1);

  console.log(
    `Validated Copilot assets: agents ${copilotAgents.length}/${sourceAgents.length}, prompts ${copilotPrompts.length}/${sourceCommands.length}, skills ${copilotSkills.length}/${sourceSkills.length}`
  );
}

validate();
