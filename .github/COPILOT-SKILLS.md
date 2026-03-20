# Skills & Knowledge Base

Everything Claude Code includes **116 specialized skills** covering best practices, design patterns, and domain knowledge.

## Strategy

Rather than duplicate all skills in `.github/`, we reference the canonical source in `/skills/` and embed critical knowledge in agent instructions.

### Core Skills (Used by Multiple Agents)

| Skill | Purpose | Agents |
|-------|---------|--------|
| **tdd-workflow** | Test-driven development with 80%+ coverage | tdd-guide, code-reviewer |
| **security-review** | Vulnerability detection and secure patterns | security-reviewer, code-reviewer |
| **api-design** | REST API design patterns and best practices | architect, planner |
| **backend-patterns** | Node.js, Express, Next.js patterns | backend developers |
| **frontend-patterns** | React, Next.js, Vue patterns | frontend developers |
| **coding-standards** | Universal code style and quality | All agents |

See `/.github/COPILOT-SKILLS.md` for complete skills inventory and how to use them.

## Using Skills in Copilot Chat

### Reference a Skill in Chat

When an agent recommends a skill:

1. Open Copilot Chat
2. Type `@skill-name` or search skill docs
3. Agent will provide relevant excerpts

Example:
```
@tdd-guide How do I test edge cases?
```

### Access Skills Directory

All skills are available at `/skills/` in the workspace:

```
/skills/tdd-workflow/
/skills/security-review/
/skills/api-design/
...
```

Agents automatically reference relevant skills from this canonical location.

## Skill Categories

### Development Methodology (Always Use)
- `tdd-workflow` — TDD with Red-Green-Refactor
- `security-review` — Security-first patterns
- `coding-standards` — Code quality baseline

### Architecture & Design
- `api-design` — REST API design patterns
- `backend-patterns` — Server-side patterns
- `frontend-patterns` — UI/Client patterns
- `architecture-decision-records` — How to document decisions

### Language-Specific Patterns
- `python-patterns` — Python idioms and patterns
- `golang-patterns` — Go best practices
- `kotlin-patterns` — Kotlin/Android patterns
- `rust-patterns` — Rust ownership & safety
- `java-coding-standards` — Java style guide
- `javascript/typescript` — Via frontend/backend-patterns

### Testing & Quality
- `e2e-testing` — Playwright end-to-end testing
- `pytorch-patterns` — ML testing and training
- `golang-testing` — Go test patterns

### Specialized Topics
- `mcp-server-patterns` — Building MCP servers
- `claude-api` — Claude API integration patterns
- `security-scan` — Automated security scanning

### Content & Communication
- `article-writing` — Long-form content creation
- `content-engine` — Multi-platform content
- `investor-outreach` — Fundraising communications
- `investor-materials` — Pitch decks and financial models

See full inventory in `/.github/COPILOT-SKILLS.md`.

## How Agents Use Skills

Agents embed relevant skill knowledge in their instructions:

**Example: TDD-Guide Agent**
- References `tdd-workflow` skill
- Provides Red-Green-Refactor cycle
- Ensures 80%+ coverage requirement

**Example: Security-Reviewer Agent**
- References `security-review` skill
- Audits for hardcoded secrets, injection vulnerabilities, etc.
- Recommends OWASP patterns

**Example: Code-Reviewer Agent**
- References `coding-standards`, `security-review`, `tdd-workflow`
- Comprehensive code quality checks
- Embedded knowledge from multiple skills

## Adding New Skills

To create a new skill or reference an existing one:

1. Write skill documentation in `/skills/skill-name/SKILL.md`
2. Reference in agent instructions with `See skill: skill-name`
3. Update this inventory document
4. Agents will automatically discover and recommend

## Accessing Skills in Your Project

All skills are available via:

```bash
# List all skills
ls /skills/

# View a specific skill
cat /skills/tdd-workflow/SKILL.md

# Search for skills matching a topic
find /skills/ -name "*.md" -exec grep -l "keyword" {} \;
```

## Best Practice: Embed Skills in Agents

Rather than requiring users to manually look up skills, agents should:

1. **Embed relevant skill knowledge** in agent instructions
2. **Provide quick examples** of the pattern
3. **Link to full skill documentation** for deep dives

Example from planner agent:
```markdown
# Implementation Plan Format

## Requirements
- [Clear, testable requirements]
- [Success criteria]

## Testing Strategy
See skill: tdd-workflow for comprehensive test planning

## Security Checklist  
See skill: security-review for OWASP checklist
```

This approach ensures:
- ✅ Users get immediate guidance (don't need to find skills)
- ✅ Reference is available for deep dives
- ✅ Uniform experience across agents
