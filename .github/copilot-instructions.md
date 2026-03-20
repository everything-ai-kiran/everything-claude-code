# GitHub Copilot Chat Instructions

## Overview

This workspace provides **28 specialized AI agents** for professional software development, testing, and collaboration. Everything Claude Code (ECC) extends GitHub Copilot with domain-specific expertise, best practices, and integrated workflow automation.

## Core Principles

1. **Agent-First** — Use specialized agents for domain tasks (code-reviewer, planner, security-reviewer, etc.)
2. **Test-Driven** — Always write tests before implementation; minimum 80% coverage required
3. **Security-First** — Validate all inputs, handle secrets securely, never hardcode credentials
4. **Immutability** — Create new objects instead of mutating existing ones
5. **Plan Before Execute** — Use the planner agent for complex features; wait for approval before coding

## Available Agents

Access agents via the Copilot Chat dropdown or invoke with `/agents-list`.

### Core Workflow Agents
- **planner** — Implementation planning, requirement analysis, risk assessment
- **code-reviewer** — Code quality, maintainability, design patterns
- **tdd-guide** — Test-driven development with 80%+ coverage
- **architect** — System design, scalability, architectural decisions
- **security-reviewer** — Vulnerability detection, security best practices

### Language-Specific Agents
- **typescript-reviewer** — TypeScript/JavaScript code review
- **python-reviewer** — Python code review
- **java-reviewer** — Java and Spring Boot code review
- **go-reviewer** — Go code review
- **rust-reviewer** — Rust code review
- **cpp-reviewer** — C++ code review
- **kotlin-reviewer** — Kotlin/Android/KMP code review

### Build & Error Resolution
- **build-error-resolver** — General build/type errors
- **typescript-build-resolver** — TypeScript compilation errors
- **python-build-resolver** — Python import/runtime errors
- **java-build-resolver** — Maven/Gradle build failures
- **go-build-resolver** — Go build errors
- **rust-build-resolver** — Rust compilation errors
- **cpp-build-resolver** — C++ compilation errors
- **kotlin-build-resolver** — Kotlin/Gradle build errors
- **pytorch-build-resolver** — PyTorch/CUDA training errors

### Specialized Agents
- **e2e-runner** — Playwright end-to-end testing
- **database-reviewer** — PostgreSQL/Supabase optimization
- **refactor-cleaner** — Dead code cleanup
- **doc-updater** — Documentation and codemaps
- **docs-lookup** — API reference research
- **chief-of-staff** — Multi-channel communication (email, Slack, LINE, Messenger)
- **loop-operator** — Autonomous loop execution and monitoring
- **harness-optimizer** — Reliability and cost tuning

## Quick Start: Slash Commands

Invoke common workflows with `/` commands:

- `/plan` — Create feature implementation plan (requires approval before coding)
- `/tdd` — Write tests first, then implementation
- `/code-review` — Review code for quality and maintainability
- `/build-fix` — Fix build or type errors
- `/security-review` — Analyze code for vulnerabilities
- `/e2e` — Generate and run end-to-end tests
- `/refactor-clean` — Remove dead code and improve structure
- `/learn` — Extract patterns and document workflows

## Workflow Example: Feature Request

1. **User:** "I need pagination for the user list API"
2. **Execute:** `/plan` → Planner agent creates detailed plan
3. **Approve:** User reviews plan, provides feedback
4. **Implement:** `/tdd` → TDD guide writes tests first, then implementation
5. **Review:** `/code-review` → Code reviewer checks quality
6. **Deploy:** Push to PR with confidence

## MCP Server Integration

External tools available via Model Context Protocol:

| Server | Purpose | Status |
|--------|---------|--------|
| **github** | PR creation, issue tracking, repo operations | Configured |
| **playwright** | Browser automation for E2E testing | Configured |
| **postgres** | Database access and query optimization | Requires env var `PG_CONNECTION_STRING` |

Configure additional servers in `.vscode/mcp.json`.

## Rules & Guardrails

See [copilot-guardrails.md](.github/rules/copilot-guardrails.md) for:
- Security requirements (no hardcoded secrets, input validation)
- Code style conventions (camelCase, immutability)
- Testing standards (80%+ coverage, TDD workflow)
- Commit message format (conventional commits)

## Backward Compatibility

This workspace maintains **dual-format agents** for cross-tool compatibility:
- ✅ Works in **GitHub Copilot Chat** (VS Code)
- ✅ Works in **Claude Code** (`claude.ai/code`)
- ✅ Works in **Cursor**, **OpenCode**, and other Claude-compatible IDEs

Agents in `.github/agents/` are automatically discovered by Copilot Chat.  
Agents in `.claude/agents/` work in Claude Code and Claude Codex.

## Getting Help

- **Agent not appearing?** Check [COPILOT-SETUP.md](COPILOT-SETUP.md#troubleshooting)
- **Tool integration issue?** Review `.vscode/mcp.json` configuration
- **Need documentation?** Use `/docs` to search library documentation
- **Questions about workflows?** Check `README.md` and project guides

## Contributing

When adding new agents or workflows:
1. Create agent in `.github/agents/*.agent.md` (Copilot format)
2. Update `AGENTS.md` with description and usage
3. Add corresponding prompt file in `.github/prompts/` if slash command is needed
4. Test in VS Code Copilot Chat dropdown
5. Verify backward compatibility with Claude Code

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for full guidelines.
