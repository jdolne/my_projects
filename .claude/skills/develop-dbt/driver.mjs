#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const YELLOW = '\x1b[33m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';
const BLUE = '\x1b[34m';

const projectRoot = process.cwd();
const dbtEnvPath = path.join(projectRoot, 'dbt-env');
const dbtBin = path.join(dbtEnvPath, 'bin', 'dbt');

function runDbtCommand(args) {
  try {
    const cmd = `source "${dbtEnvPath}/bin/activate" && dbt ${args}`;
    return execSync(cmd, {
      cwd: projectRoot,
      shell: '/bin/bash',
      encoding: 'utf-8'
    });
  } catch (error) {
    throw new Error(`dbt command failed: ${error.message}`);
  }
}

function validateYamlStructure(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return { valid: false, error: `File not found: ${filePath}` };
    }

    const content = fs.readFileSync(filePath, 'utf-8');

    // Basic YAML structure checks
    if (filePath.includes('schema.yml')) {
      if (!content.includes('models:') && !content.includes('sources:') && !content.includes('macros:')) {
        return { valid: false, error: 'schema.yml must contain models, sources, or macros section' };
      }
    }

    if (filePath.includes('_macros_docs.yml')) {
      if (!content.includes('macros:')) {
        return { valid: false, error: '_macros_docs.yml must contain macros section' };
      }
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

function validateSqlSyntax(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return { valid: false, error: `File not found: ${filePath}` };
    }

    const content = fs.readFileSync(filePath, 'utf-8');

    // Check for unclosed Jinja blocks
    const openBlocks = (content.match(/\{\%\s*(if|for|macro|set|call)/g) || []).length;
    const closeBlocks = (content.match(/\{\%\s*end(if|for|macro|set|call)/g) || []).length;

    if (openBlocks !== closeBlocks) {
      return { valid: false, error: `Mismatched Jinja blocks: ${openBlocks} open, ${closeBlocks} closed` };
    }

    // Check for unclosed Jinja variables
    const openVars = (content.match(/\{\{/g) || []).length;
    const closeVars = (content.match(/\}\}/g) || []).length;

    if (openVars !== closeVars) {
      return { valid: false, error: `Mismatched Jinja variables: ${openVars} open, ${closeVars} closed` };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

function parseProject() {
  try {
    console.log(`${BLUE}Parsing dbt project structure...${RESET}`);
    const output = runDbtCommand('parse --quiet');
    console.log(`${GREEN}✓ Project parsed successfully${RESET}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function compileProject() {
  try {
    console.log(`${BLUE}Compiling dbt models...${RESET}`);
    const output = runDbtCommand('compile --quiet');
    console.log(`${GREEN}✓ Models compiled successfully${RESET}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function generateDocs() {
  try {
    console.log(`${BLUE}Generating dbt documentation...${RESET}`);
    const output = runDbtCommand('docs generate --quiet');
    console.log(`${GREEN}✓ Documentation generated in target/compiled/index.html${RESET}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function listModels() {
  try {
    const output = runDbtCommand('ls --select models');
    return { success: true, output };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function listMacros() {
  try {
    const output = runDbtCommand('ls --select macros');
    return { success: true, output };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function validateFile(filePath) {
  const isYaml = filePath.endsWith('.yml') || filePath.endsWith('.yaml');
  const isSql = filePath.endsWith('.sql');

  console.log(`${BLUE}Validating: ${filePath}${RESET}`);

  if (isYaml) {
    const result = validateYamlStructure(filePath);
    if (result.valid) {
      console.log(`${GREEN}✓ YAML structure valid${RESET}`);
    } else {
      console.log(`${RED}✗ YAML validation failed: ${result.error}${RESET}`);
      process.exit(1);
    }
  }

  if (isSql) {
    const result = validateSqlSyntax(filePath);
    if (result.valid) {
      console.log(`${GREEN}✓ SQL syntax valid${RESET}`);
    } else {
      console.log(`${RED}✗ SQL validation failed: ${result.error}${RESET}`);
      process.exit(1);
    }
  }
}

function showHelp() {
  console.log(`
${BLUE}dbt Development Driver${RESET}

Commands:
  validate <file>      Validate a dbt YAML or SQL file
  parse                Parse the entire dbt project
  compile              Compile all dbt models
  docs                 Generate dbt documentation
  models               List all models
  macros               List all macros
  help                 Show this help message

Examples:
  validate models/example/schema.yml
  validate macros/cents_to_dollars.sql
  parse
  compile
  docs
  models
  macros
  `);
}

function main() {
  const command = process.argv[2];
  const arg = process.argv[3];

  try {
    switch (command) {
      case 'validate':
        if (!arg) {
          console.error(`${RED}Error: validate requires a file path${RESET}`);
          showHelp();
          process.exit(1);
        }
        validateFile(arg);
        break;

      case 'parse':
        parseProject();
        break;

      case 'compile':
        compileProject();
        break;

      case 'docs':
        generateDocs();
        break;

      case 'models':
        const modelsResult = listModels();
        if (modelsResult.success) {
          console.log(modelsResult.output);
        } else {
          console.error(`${RED}Error: ${modelsResult.error}${RESET}`);
          process.exit(1);
        }
        break;

      case 'macros':
        const macrosResult = listMacros();
        if (macrosResult.success) {
          console.log(macrosResult.output);
        } else {
          console.error(`${RED}Error: ${macrosResult.error}${RESET}`);
          process.exit(1);
        }
        break;

      case 'help':
      case '--help':
      case '-h':
        showHelp();
        break;

      default:
        showHelp();
        process.exit(1);
    }
  } catch (error) {
    console.error(`${RED}Error: ${error.message}${RESET}`);
    process.exit(1);
  }
}

main();
