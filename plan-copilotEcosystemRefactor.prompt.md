# Copilot Chat Ecosystem Refactor for Everything Claude Code

**TL;DR:** Extend the existing hybrid multi-tool structure (`.claude/`, `.agents/`, `.cursor/`, etc.) with **Copilot-native directories** (`.github/agents/`, `.github/prompts/`, `.vscode/mcp.json`) while keeping the master agent/skill definitions DRY through shared formats. This enables the workspace to work seamlessly in **VS Code Copilot Chat** without duplicating content across tools.

---

## **Phase 1: Directory & Configuration Structure** 
1. Create `.github/agents/` — Copilot-discoverable agent files (`.agent.md` format)
2. Create `.github/prompts/` — Prompt files for "/" commands replicate ECC's `/tdd`, `/plan`, etc.
3. Create `.github/copilot-instructions.md` — Global Copilot workspace instructions (replaces AGENTS.md header for Copilot)
4. Create `.vscode/mcp.json` — MCP server configuration for Copilot to use external tools
5. Create `.vscode/settings.json` — Default Copilot Chat settings for the workspace
6. Create `.github/COPILOT-SETUP.md` — Onboarding guide for Copilot users

## **Phase 2: Agent Porting** 
7. Convert 28 ECC agents from `/agents/*.md` → `.github/agents/*.agent.md` 
   - Keep dual format: agents discoverable from both `.claude/agents/` (Claude) and `.github/agents/` (Copilot)
   - Update YAML frontmatter: convert tool format `"tool1, tool2"` → `['tool1', 'tool2']` for Copilot
8. Map built-in Claude tools to **Copilot equivalents**:
   - `Read` → `vscode/read`, `grep`, `search`
   - `Edit` → `vscode/edit`
   - `Terminal` → `terminal`
   - Custom tools → MCP servers or VS Code extension tools
9. Identify which agents have **interdependencies** (e.g., planner → code-reviewer) and document handoff chains

## **Phase 3: Commands → Prompt Files**
10. Convert 59 ECC commands from `/commands/*.md` → `.github/prompts/*.prompt.md`
    - `/tdd` command → `.github/prompts/tdd.prompt.md`
    - `/plan` → `.github/prompts/plan.prompt.md`
    - Format: YAML frontmatter with `description` + Markdown body
11. Verify slash-command invocation works in Copilot Chat (`/tdd`, `/code-review`, etc.)

## **Phase 4: Skills & Knowledge Extraction**
12. Assess each skill in `/skills/*/SKILL.md`:
    - **High-level procedural skills** (tdd-workflow, security-review, api-design) → Convert to `.github/skills/` directory, embed in agent markdown or separate documentation
    - **Framework-specific guides** (react patterns, backend-patterns) → Move to `.github/knowledge/` or embed in per-file instructions
13. Create `.github/knowledge/` for reusable domain knowledge (alternative: embed directly in agent skills using Copilot's hierarchical customization)

## **Phase 5: MCP Server Strategy**
14. Audit which agents/skills depend on **external services** (database-reviewer → PostgreSQL, e2e-runner → Playwright):
    - Create MCP servers for critical tools (Playwright, GitHub API, database queries)
    - Document in `.vscode/mcp.json` with credentials/auth strategy
15. Create stub MCP servers or mark integration points for future implementation

## **Phase 6: Rules & Guardrails**
16. Port guardrails from `.claude/rules/everything-claude-code-guardrails.md`:
    - Create `.github/rules/copilot-guardrails.md` 
    - Embed critical guardrails in `.github/copilot-instructions.md`
    - Link from `.github/COPILOT-SETUP.md`

## **Phase 7: Hooks & Automations**
17. Analyze `/hooks/hooks.json`:
    - Identify automations that apply to Copilot workflows
    - Document which hooks depend on **Claude-specific events** (e.g., session handlers)
    - Create `.github/hooks.json` for Copilot-compatible automations (alt: use VS Code Tasks/Workspace settings)

## **Phase 8: Testing & Validation**
18. **Local verification**:
    - Test agents are discoverable in VS Code Copilot Chat dropdown
    - Invoke `/tdd`, `/plan`, `/code-review` slash commands
    - Verify MCP tools are registered and callable
19. **E2E workflow**: Run a sample feature request through planner → tdd-guide → code-reviewer agents
20. **Compatibility**: Verify `.claude/` agents still work in Claude Code (backward compatibility)

## **Phase 9: Documentation & Migration Guide**
21. Update `README.md` with:
    - "Works with: Claude Code, GitHub Copilot Chat, Cursor, OpenCode"
    - Quick-start for each platform
22. Create `COPILOT-SETUP.md` with:
    - Installation steps (clone/copy to workspace)
    - First agent invocation example
    - Troubleshooting common issues
23. Document hand-off workflow (switching from Claude Code to Copilot mid-session)

## **Phase 10: Optional Enhancements**
24. Create Copilot Chat **extension** or **skill** bundling (if Copilot adds native skill distribution in future updates)
25. Experiment with **MCP Resource exploration** for multi-agent knowledge sharing
26. Set up CI/CD to validate agent YAML on each commit (similar to current linting)

---

## **Relevant Files**

- [AGENTS.md](AGENTS.md) — Master agent definitions (28 agents)
- [agents/](agents/) — Agent Markdown files (to be ported)
- [commands/](commands/) — Command definitions (59 files, to be ported)
- [skills/](skills/) — Skills with reusable patterns
- [rules/](rules/) — Coding and security rules
- [hooks/hooks.json](hooks/hooks.json) — Automation triggers
- [.claude/](/.claude/) — Existing Claude-specific config
- [.github/](/.github/) — Existing GitHub workflows (to be extended)

**New files to create:**
- `.github/agents/` — Copilot agent directory
- `.github/prompts/` — Slash command prompt files
- `.github/copilot-instructions.md` — Workspace instructions
- `.github/COPILOT-SETUP.md` — Onboarding
- `.vscode/mcp.json` — MCP server registry
- `.vscode/settings.json` — Copilot Chat defaults

---

## **Verification Checklist**

1. ✅ Agents visible in VS Code Copilot Chat dropdown (28 agents, searchable)
2. ✅ Slash commands functional (`/tdd`, `/plan`, `/code-review`, etc.) with correct agent invocation
3. ✅ MCP tools properly configured and callable by agents (test with database-reviewer or e2e-runner)
4. ✅ Backward compatibility: `.claude/agents/` still works in Claude Code
5. ✅ Skills knowledge accessible in agent context (either embedded or linked)
6. ✅ Sample workflow: User requests feature → Planner agent creates plan → TDD agent writes tests → Code Reviewer checks quality
7. ✅ Guardrails enforced (security-first, immutability principles appear in agent instructions)
8. ✅ Documentation complete and tutorials runnable

---

## **Key Decisions**

- **Format preservation**: Use `.agent.md` (Copilot native) + keep `.claude/agents/` format for cross-tool compatibility. Tools auto-convert YAML array format.
- **Skills strategy**: Embed high-impact skills in agent markdown bodies rather than separate knowledge files (simpler discovery, less configuration)
- **MCP servers**: Start with stub configurations for critical tools (Playwright, GitHub); expand as needed
- **Hooks**: Convert only Copilot-compatible hooks; document Claude-specific automation as "not yet ported"
- **Master definitions**: Store in `/agents/` and `/commands/` (canonical); auto-sync or document translation to `.github/`

---

## **Further Considerations** 

1. **Semi-automatic sync or manual port?**
   - Option A: Script to auto-generate `.github/agents/` from `/agents/*.md` with format translation (DRY, complex validation)
   - Option B: Manual port with review at each step (quality, slower)
   - **Recommendation**: Option A (script-based) with human validation - create a GitHub Action to validate agent YAML on PR

2. **Cloud deployment future?**
   - Copilot Agents can run on Azure with Foundry (separate stack). Current plan focuses on VS Code Chat only.
   - **Decision**: Defer cloud agent deployment to Phase 2; document as future roadmap

3. **Enterprise onboarding?**
   - Should the workspace include SAML/SSO setup for Copilot Teams features?
   - **Recommendation**: Add `.github/COPILOT-TEAMS.md` as optional extension for enterprise users
