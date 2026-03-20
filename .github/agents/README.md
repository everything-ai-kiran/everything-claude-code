# Copilot Agents

This directory contains agents discoverable by GitHub Copilot Chat in VS Code.

## Structure

Each file is a Copilot agent definition in `.agent.md` format:

```yaml
---
name: agent-name
description: One-line description of agent purpose
tools: ['tool1', 'tool2', 'vscode/read', 'vscode/edit']
model: ['claude-opus', 'gpt-4-turbo']
user-invocable: true
---

# Agent Instructions

Full Markdown instructions for the agent...
```

## Discovery

Agents in this directory are auto-discovered by Copilot Chat. To see available agents:

1. Open Copilot Chat (`Cmd+Shift+I`)
2. Click agent dropdown (top of panel)
3. All `.agent.md` files appear in the list

## Adding New Agents

1. Create `.github/agents/my-agent.agent.md`
2. Add YAML frontmatter + Markdown instructions
3. Reload Copilot (`Cmd+R` or restart VS Code)
4. Agent appears in dropdown

See [COPILOT-SETUP.md](../COPILOT-SETUP.md#advanced-creating-custom-agents) for detailed guidelines.

## Tool Reference

### Built-in VS Code Tools
- `vscode/read` — Read file contents
- `vscode/edit` — Edit files
- `vscode/search` — Search workspace
- `vscode/grep` — Grep patterns
- `vscode/terminal` — Run terminal commands
- `vscode/problems` — Access diagnostics
- `vscode/browser` — Open URLs

### MCP Tools (configured in `.vscode/mcp.json`)
- `github` — GitHub API operations
- `playwright` — Browser automation
- `postgres` — Database queries

### Tool Response Format
- Tools return structured data (JSON, text, or object)
- Agent processes and summarizes for user
- Errors are caught and explained to user

## Agent Template

```yaml
---
name: my-agent
description: One-line description
tools: ['vscode/read', 'vscode/edit']
model: 'claude-opus'
---

# Your Agent Title

You are expert in [domain].

## Your Role

- Responsibility 1
- Responsibility 2

## How You Operate

1. Analyze the request
2. Ask clarifying questions if needed
3. Use tools to gather context
4. Provide recommendations
5. Execute with user approval
```

## Best Practices

- **Keep frontmatter minimal** — Only required fields
- **Clear instructions** — Agent behavior easy to predict
- **Define tool usage** — When and why to use each tool
- **Ask before executing** — Especially for destructive operations
- **Provide summaries** — Explain what you did and why

## Dual Format Support

Agents can be discovered from two locations:
- `.github/agents/` — Copilot Chat (VS Code)
- `.claude/agents/` — Claude Code (claude.ai/code)

Both formats are automatically kept in sync by the build system. Edit the canonical source (typically `.claude/agents/`) and copy to `.github/agents/` during release.
