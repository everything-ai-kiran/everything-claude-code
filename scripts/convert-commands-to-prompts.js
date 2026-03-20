#!/usr/bin/env node

/**
 * Convert commands from Claude format to Copilot prompt format
 * 
 * Usage: node scripts/convert-commands-to-prompts.js
 * 
 * Reads: /commands/*.md (Claude format)
 * Writes: .github/prompts/*.prompt.md (Copilot format)
 */

const fs = require('fs');
const path = require('path');

/**
 * Main conversion function
 */
async function main() {
  const sourceDir = path.join(__dirname, '../commands');
  const targetDir = path.join(__dirname, '../.github/prompts');

  // Create target directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Get all command files
  const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.md'));

  console.log(`Found ${files.length} commands to convert...\n`);

  const results = {
    success: [],
    error: [],
  };

  for (const file of files) {
    try {
      const sourcePath = path.join(sourceDir, file);
      const fileName = path.basename(file, '.md');
      const targetPath = path.join(targetDir, `${fileName}.prompt.md`);

      // Read source file
      const content = fs.readFileSync(sourcePath, 'utf-8');

      // For prompts, the format is the same as commands
      // Just copy directly, only rename the file
      fs.writeFileSync(targetPath, content, 'utf-8');

      results.success.push({
        source: file,
        target: path.basename(targetPath),
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

  console.log(`Converted prompts written to: ${targetDir}`);
  console.log('Next steps:');
  console.log('1. Test slash commands in VS Code Copilot Chat (type "/" to see available)');
  console.log('2. Verify each command invokes the correct agent');
  console.log('3. Commit changes: git add .github/prompts/');
}

main().catch(error => {
  console.error('Conversion failed:', error);
  process.exit(1);
});
