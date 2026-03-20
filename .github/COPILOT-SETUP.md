# GitHub Copilot Chat Setup Guide

Everything Claude Code (ECC) extends GitHub Copilot Chat with 28 specialized agents for production software development.

## Prerequisites

- **VS Code** 1.96.0 or later
- **GitHub Copilot Chat** extension (available in VS Code Marketplace)
- **GitHub account** with Copilot subscription

## Installation Steps

### 1. Clone or Install Repository

```bash
# Clone into your workspace
git clone https://github.com/everything-ai-kiran/everything-claude-code.git
cd everything-claude-code

# OR: Copy to user's Copilot agents directory
cp -r . ~/.copilot/
```

### 2. Open in VS Code

```bash
code .
# or open the folder in VS Code UI
```

### 3. Verify Agent Discovery

1. Open **VS Code Command Palette** (`Cmd+Shift+P` on Mac)
2. Type "Copilot Chat" and select "Open Copilot Chat"
3. Click agent dropdown (top of chat panel)
4. You should see agents listed:
   - ✅ `planner`, `code-reviewer`, `tdd-guide`, etc.
   - If empty, check [Troubleshooting](#troubleshooting)

### 4. Configure MCP Servers (Optional)

If you want to use database, GitHub, or Playwright tools:

```bash
# Copy and configure MCP
cp .vscode/mcp.json ~/.config/Code/User/globalStorage/GitHub.copilot-chat/mcp.json

# Set required environment variables
export PG_CONNECTION_STRING="postgresql://user:pass@localhost/db"
export GITHUB_TOKEN="ghp_..."
```

## First Agent Invocation

### Example: Plan a Feature

1. **Open Copilot Chat** (`Cmd+Shift+I`)
2. **Select `planner` agent** from dropdown
3. **Type your request:**
   ```
   I need to add OAuth2 authentication to our API
   ```
4. **Agent creates plan** — Review and ask clarifying questions
5. **Approve plan** — Type "Yes, proceed" or "@planner refine the plan to..."
6. **Switch to `tdd-guide`** — Execute `/tdd` for test-first implementation

### Example: Review Code

1. **After writing code**, open Copilot Chat
2. **Select `code-reviewer` agent**
3. **Paste code or reference file** — "@code-reviewer review this function"
4. **Get quality feedback** — Violations, design issues, security concerns
5. **Execute fixes** — Quick actions or manual refactoring

### Example: Fix Build Errors

1. **When build fails**, open terminal output
2. **Copy error stack**
3. **Open Copilot Chat**, select appropriate **build-resolver** agent:
   - `typescript-build-resolver` for TS compilation
   - `java-build-resolver` for Maven/Gradle
   - `python-build-resolver` for Python imports
4. **Paste error** — Agent identifies root cause and suggests fixes

## Slash Commands

Common workflows available as slash commands:

| Command | Agent | Purpose |
|---------|-------|---------|
| `/plan` | planner | Create implementation plan |
| `/tdd` | tdd-guide | Write tests → implementation |
| `/code-review` | code-reviewer | Quality review |
| `/build-fix` | build-resolver | Fix compilation/type errors |
| `/security-review` | security-reviewer | Vulnerability scan |
| `/e2e` | e2e-runner | Generate + run Playwright tests |
| `/refactor-clean` | refactor-cleaner | Remove dead code |
| `/learn` | — | Extract patterns from session |

**To use:** Type `/` in chat, then command name:
```
/plan Create a feature for batch payment processing
```

## Configuration

### workspace Settings (`/.vscode/settings.json`)

Customize Copilot behavior:

```json
{
  "github.copilot.chat.localeOverride": "en",
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  }
}
```

### Global Instructions (`.github/copilot-instructions.md`)

Apply to all agents in this workspace. Modify to adjust tone, guardrails, or specific requirements.

### Per-Agent Overrides (`.github/agents/*.agent.md`)

Each agent has its own Markdown file with YAML frontmatter:

```yaml
---
name: planner
description: Expert planning specialist
tools: ['vscode/read', 'vscode/search', 'vscode/grep']
model: ['claude-opus', 'gpt-4-turbo']
---
```

## Troubleshooting

### Agents Not Appearing in Dropdown

1. **Check folder location:**
   - Agents must be in `.github/agents/` (workspace)
   - Or `~/.copilot/agents/` (user profile)
   
2. **Verify file format:**
   ```bash
   # Must be .agent.md files with YAML frontmatter
   ls -la .github/agents/
   # Should show: planner.agent.md, code-reviewer.agent.md, etc.
   ```

3. **Reload Copilot:**
   - Close Copilot Chat panel
   - Run "Dev: Reload Window" (`Cmd+R`)
   - Reopen Copilot Chat

4. **Check VS Code version:**
   ```bash
   code --version
   # Should be 1.96.0+
   ```

### MCP Tools Not Available

1. **Verify mcp.json exists:**
   ```bash
   cat .vscode/mcp.json
   ```

2. **Check environment variables:**
   ```bash
   echo $PG_CONNECTION_STRING  # For database tools
   echo $GITHUB_TOKEN          # For GitHub tools
   ```

3. **Restart VS Code** after setting env vars

4. **Check MCP server status:**
   - Open Copilot Chat
   - Click "Tools" icon (gear)
   - Verify servers are listed and green

### Slash Commands Not Working

1. **Verify prompts exist:**
   ```bash
   ls -la .github/prompts/
   # Should show: tdd.prompt.md, plan.prompt.md, etc.
   ```

2. **Type `/` to see available commands:**
   - Type `/` in Copilot Chat
   - Full list should appear (auto-completion)

3. **Check prompt file format:**
   ```yaml
   ---
   description: "TDD workflow — write tests first"
   ---
   # Markdown body here
   ```

### "Model not available" Error

If agent won't load:

1. **Check model in agent frontmatter:**
   ```yaml
   model: ['claude-opus', 'gpt-4']
   ```

2. **Available models in Copilot Chat:**
   - `claude-opus` (Anthropic Claude 3.5 Opus)
   - `gpt-4-turbo` (OpenAI GPT-4)
   - `mixtral` (Mistral)

3. **Switch to available model:**
   - Edit `.github/agents/your-agent.agent.md`
   - Change `model: 'gpt-4-turbo'`
   - Reload Copilot

## Updating Agents

When agents are updated in the repository:

```bash
# Pull latest changes
git pull origin main

# Reload Copilot
# VS Code: Cmd+R (Dev: Reload Window)
# Or: Close and reopen VS Code
```

Agents auto-discover on startup — no manual registration needed.

## Advanced: Creating Custom Agents

1. **Create new agent file:**
   ```bash
   touch .github/agents/my-agent.agent.md
   ```

2. **Add YAML frontmatter + Markdown:**
   ```yaml
   ---
   name: my-agent
   description: What this agent does
   tools: ['vscode/read', 'vscode/edit', 'vscode/terminal']
   model: 'claude-opus'
   ---
   
   # Agent Instructions
   
   You are expert in...
   ```

3. **Reload Copilot** — Agent appears in dropdown

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for full guidelines.

## Support

- **GitHub Issues:** [Report bugs](https://github.com/everything-ai-kiran/everything-claude-code/issues)
- **Documentation:** [README.md](../../README.md), [AGENTS.md](../../AGENTS.md)
- **Copilot Docs:** [Official GitHub Copilot docs](https://docs.github.com/en/copilot)

## Cross-Tool Compatibility

This workspace works in multiple environments:

| Tool | Status | Location |
|------|--------|----------|
| **Copilot Chat (VS Code)** | ✅ Full support | `.github/agents/` |
| **Claude Code** | ✅ Full support | `.claude/agents/` |
| **Cursor** | ✅ Full support | `.claude/agents/` |
| **OpenCode** | ✅ Full support | `.claude/agents/` |

Agents sync automatically across formats — no duplication needed.
