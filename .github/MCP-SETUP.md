# MCP Server Configuration Guide

This guide explains how to set up and configure Model Context Protocol (MCP) servers for use with GitHub Copilot Chat in this workspace.

## Overview

MCP servers extend Copilot's capabilities by providing:
- **Tools** — Reusable functions agents can call
- **Resources** — Read-only context data
- **Prompts** — Pre-written instructions/templates

## Configured Servers

### Standard Servers (Built-In)

VS Code Copilot provides these as built-in tools:
- `vscode/read` — Read file contents
- `vscode/edit` — Modify files
- `vscode/grep` — Search text patterns
- `vscode/search` — Find files by name
- `vscode/terminal` — Run shell commands
- `vscode/problems` — Access diagnostics
- `vscode/browser` — Open URLs

All 28 agents use these standard tools by default.

### Optional MCP Servers

Additional servers can be configured in `.vscode/mcp.json`:

#### GitHub API (`github`)
**Purpose:** PR creation, issue tracking, repository operations  
**Used by:** code-reviewer, planner (for PR context)  
**Setup:**
```bash
# Set GitHub token
export GITHUB_TOKEN="ghp_xxxxxxxxxxxxx"
```

#### Playwright (`playwright`)
**Purpose:** Browser automation for E2E testing  
**Used by:** e2e-runner agent  
**Install:**
```bash
npm install -D @modelcontextprotocol/server-playwright
```
**Configuration:** Already in `.vscode/mcp.json`

#### PostgreSQL (`postgres`)
**Purpose:** Database queries and optimization  
**Used by:** database-reviewer agent  
**Setup:**
```bash
# Set PostgreSQL connection string
export PG_CONNECTION_STRING="postgresql://user:password@localhost/dbname"

# Install MCP server
npm install -D @modelcontextprotocol/server-postgres
```

## Custom MCP Servers

### Creating Your Own MCP Server

If you need custom tools not covered by built-in or standard servers:

1. **Create MCP server** (Node.js, Python, or other language)
   ```bash
   npm install @modelcontextprotocol/sdk
   ```

2. **Implement tools** your server will expose
   ```typescript
   server.setRequestHandler(CallToolRequestSchema, async (request) => {
     // Tool implementation
   });
   ```

3. **Register in .vscode/mcp.json**
   ```json
   "my-custom-tool": {
     "type": "stdio",
     "command": "node",
     "args": ["./my-server.js"]
   }
   ```

4. **Reference in agent** tools array
   ```yaml
   tools: ['vscode/read', 'my-custom-tool']
   ```

5. **Test in Copilot Chat**
   - Restart VS Code
   - Open agent dropdown
   - Verify tool appears in agent's capabilities

See [MCP Server Patterns Skill](../../skills/mcp-server-patterns/SKILL.md) for detailed examples.

## Configuration File Structure

### `.vscode/mcp.json` Format

```json
{
  "servers": {
    "server-name": {
      "type": "stdio" | "http",
      "command": "npm" | "python" | "node",
      "args": ["server-package-or-script"],
      "description": "What this server does",
      "env": {
        "VAR_NAME": "${VAR_NAME}"  // References environment variables
      }
    }
  },
  "settings": {
    "security": {
      "trustedDomains": [...],
      "sandboxMode": "strict"
    }
  }
}
```

### Server Types

**`stdio`** — Direct process execution
- Command runs as subprocess
- Bi-directional communication via stdin/stdout
- Best for: Local Node.js, Python, compiled binaries

**`http`** — Network communication
- Server runs on HTTP endpoint
- Copilot communicates via HTTP/JSON-RPC
- Best for: Remote APIs (GitHub, external services)

## Environment Variables

Secrets and configuration use environment variables:

```bash
# Set in terminal before starting VS Code
export GITHUB_TOKEN="gh p_..."
export PG_CONNECTION_STRING="postgresql://..."
export ANTHROPIC_API_KEY="sk-..."

# Then launch VS Code
code .
```

Or add to `.env.local` (not committed to git):

```bash
# .env.local
GITHUB_TOKEN=ghp_xxxxx
PG_CONNECTION_STRING=postgresql://user:pass@localhost/db
```

Reference in `mcp.json`:
```json
"env": {
  "PG_CONNECTION_STRING": "${PG_CONNECTION_STRING}"
}
```

## Troubleshooting MCP Servers

### Server Not Loading

1. **Check VS Code version**
   ```bash
   code --version
   # Must be 1.96.0+
   ```

2. **Verify mcp.json syntax**
   ```bash
   # Check for JSON errors
   jsonlint .vscode/mcp.json
   ```

3. **Check server binary exists**
   ```bash
   which node
   npm list @modelcontextprotocol/server-playwright
   ```

4. **Enable debug logging**
   - Open VS Code settings
   - Search: "MCP Debug"
   - Enable logging
   - Check Output panel → "GitHub Copilot Chat"

### Environment Variables Not Found

1. **Verify variable is set**
   ```bash
   echo $PG_CONNECTION_STRING
   # Should print value, not empty
   ```

2. **Restart VS Code after setting vars**
   - Close all VS Code windows
   - Re-open from terminal with env vars set:
   ```bash
   export GITHUB_TOKEN="..." && code .
   ```

3. **Check `.env.local` permissions**
   - File must be readable by your user
   - Not in `.gitignore` (add if needed)

### Tool Not Available in Agent

1. **Verify tool name in agent frontmatter**
   ```yaml
   tools: ['vscode/read', 'my-server', 'github']
   ```

2. **Check server is registered in mcp.json**
   ```bash
   grep "my-server" .vscode/mcp.json
   ```

3. **Reload Copilot**
   - Cmd+Shift+P → "Dev: Reload Window"
   - Wait 5 seconds
   - Re-open Copilot Chat

4. **Check server logs**
   - Output panel → "MCP" tab
   - Look for connection errors

## Agent-to-MCP Mapping

| Agent | Required MCP Servers |
|-------|----------------------|
| `code-reviewer` | github (optional for PR context) |
| `e2e-runner` | playwright |
| `database-reviewer` | postgres |
| `docs-lookup` | context7 (custom, not yet configured) |
| `chief-of-staff` | gmail, slack, messenger (custom) |
| All others | vscode/* (built-in) |

## Adding New MCP Servers

### Example: Supabase/PostgreSQL

1. **Install MCP server**
   ```bash
   npm install @modelcontextprotocol/server-postgres
   ```

2. **Update .vscode/mcp.json**
   ```json
   {
     "servers": {
       "supabase": {
         "type": "stdio",
         "command": "npx",
         "args": ["@modelcontextprotocol/server-postgres"],
         "description": "Supabase PostgreSQL database",
         "env": {
           "PG_CONNECTION_STRING": "${SUPABASE_CONNECTION_STRING}"
         }
       }
     }
   }
   ```

3. **Set environment variable**
   ```bash
   export SUPABASE_CONNECTION_STRING="postgresql://..."
   ```

4. **Update agent**
   ```yaml
   # In database-reviewer.agent.md
   tools: ['vscode/read', 'vscode/grep', 'supabase']
   ```

5. **Test**
   - Reload Copilot
   - Invoke database-reviewer agent
   - Should see "supabase" in available tools

## Security Best Practices

### Secrets Management

- ❌ Never commit secrets to git
- ❌ Never hardcode API keys in mcp.json
- ✅ Use environment variables: `"${VAR_NAME}"`
- ✅ Use `.env.local` (add to .gitignore)
- ✅ Use system secret manager (Apple Keychain, Windows Credential Manager)

### MCP Server Sandboxing

The workspace enforces strict MCP security:

```json
"settings": {
  "security": {
    "trustedDomains": ["api.github.com", "localhost"],
    "sandboxMode": "strict"
  }
}
```

This prevents:
- Servers from accessing files outside sandbox
- Network access to untrusted domains
- Execution of arbitrary commands

### Token Rotation

If a secret is exposed:

1. **Revoke immediately**
   ```bash
   # GitHub
   # Go to Personal access tokens → Revoke exposed token
   ```

2. **Rotate secret**
   ```bash
   export NEW_GITHUB_TOKEN="ghp_newtoken"
   ```

3. **Update environment**
   ```bash
   # Update .env.local or system environment
   ```

4. **Audit usage**
   ```bash
   # Check GitHub security log for unauthorized access
   ```

## Testing MCP Servers

### Manual Test

1. **Open Copilot Chat**
2. **Select an agent that uses the server**
3. **Observe tool execution**

Example with database-reviewer:
```
@database-reviewer Show me the query performance for orders table
```

### Automated Testing

Create a test script:

```bash
#!/bin/bash
# test-mcp.sh

echo "Testing PostgreSQL connection..."
export PG_CONNECTION_STRING="postgresql://..."

# Try a simple query via agent
node -e "
  const { spawn } = require('child_process');
  const proc = spawn('npx', ['@modelcontextprotocol/server-postgres']);
  proc.stdout.on('data', (d) => console.log('OK: Server running'));
  setTimeout(() => proc.kill(), 2000);
"

echo "Done!"
```

## Next Steps

1. Review current configuration in `.vscode/mcp.json`
2. Set up required environment variables
3. Test agents that depend on MCP servers
4. Enable additional servers as needed

See `/.github/COPILOT-SETUP.md` for integration instructions.
