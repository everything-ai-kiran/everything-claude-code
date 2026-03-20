# Copilot Rules

This directory contains guardrails and rules for agents and workflows.

## Contents

- **copilot-guardrails.md** — Security, testing, code style, and quality requirements

## Applying Rules

Rules are referenced in:
- **`.github/copilot-instructions.md`** — Global workspace instructions
- **`.github/agents/*.agent.md`** — Individual agent instructions
- **GitHub Action CI/CD** — Validation on PR

## Updating Rules

When modifying guardrails:

1. Edit `copilot-guardrails.md`
2. Update cross-references in `copilot-instructions.md`
3. Create PR with changes
4. Get approval from maintainers
5. Merge and validate in CI

## Enforcing Rules

Rules are enforced through:
- **Code review** — Agents check against guardrails
- **Linting** — ESLint, Prettier, etc.
- **Testing** — 80% coverage minimum
- **Security scan** — Security-reviewer agent
- **CI/CD pipeline** — Automated validation

See [copilot-guardrails.md](copilot-guardrails.md) for detailed requirements.
