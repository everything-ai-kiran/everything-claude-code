# Copilot Prompt Files

This directory contains slash command prompt files for GitHub Copilot Chat.

## Structure

Each file is a prompt definition in `.prompt.md` format (Markdown with YAML frontmatter):

```yaml
---
description: "One-line description shown in slash command list"
---

# Prompt Title

Your instructions/prompt text here...
```

## Discovery

Prompts in this directory are auto-discovered as slash commands. To use:

1. Open Copilot Chat (`Cmd+Shift+I`)
2. Type `/` to see available commands
3. Select desired prompt
4. Chat gets the prompt context

## Available Prompts

| Command | Purpose | Agent |
|---------|---------|-------|
| `/plan` | Create implementation plan | planner |
| `/tdd` | Write tests first | tdd-guide |
| `/code-review` | Review code quality | code-reviewer |
| `/build-fix` | Fix build errors | build-resolver |
| `/security-review` | Security analysis | security-reviewer |
| `/e2e` | Generate E2E tests | e2e-runner |
| `/refactor-clean` | Remove dead code | refactor-cleaner |
| `/learn` | Extract patterns | — |

## Adding New Prompts

1. Create `.github/prompts/my-prompt.prompt.md`
2. Add YAML frontmatter + Markdown body
3. Reload Copilot (`Cmd+R` or restart VS Code)
4. Command `/my-prompt` appears in auto-complete

## Prompt Template

```yaml
---
description: "What this command does"
---

# Command Title

Detailed instructions for the prompt...

## When to Use

- Scenario 1
- Scenario 2

## How It Works

1. Step 1
2. Step 2

## Example

```code
example here
```
```

## Best Practices

- **Clear descriptions** — Shown in slash command auto-complete
- **Action-oriented names** — `/plan-feature`, not `/planning`
- **Include examples** — Help users understand what to provide
- **Link to agents** — Reference relevant agents when applicable
- **Keep focused** — One workflow per prompt

## Linking Agent to Prompt

To invoke a specific agent from a prompt:

```markdown
---
description: "Run planner agent"
agent: "planner"
---

# Plan Feature

Use the planner agent to...
```

## Tips

- Type `/` in chat to see all available prompts
- Prompts are case-insensitive
- Auto-complete matches partial names
- Modify prompts to customize behavior
