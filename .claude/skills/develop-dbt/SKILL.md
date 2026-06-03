---
name: develop-dbt
description: Validate, edit, and develop dbt models, macros, tests, and YAML artifacts
tags: [dbt, development, validation, sql, yaml]
---

# Develop dbt Artifacts

This skill provides a development workflow for creating and editing dbt models, macros, tests, and documentation. It validates YAML structure and SQL syntax without requiring database credentials, making it ideal for local development.

## Overview

The driver at `.claude/skills/develop-dbt/driver.mjs` is a Node.js CLI that wraps dbt commands and provides syntax validation for dbt artifacts. Use it to:

- **Validate** YAML and SQL files after editing
- **Parse** the entire dbt project to catch structure errors
- **Compile** models to find SQL issues
- **Generate documentation** from your YAML definitions
- **List** models and macros to understand the project structure

## Quick Start

Before making changes:
```bash
node .claude/skills/develop-dbt/driver.mjs parse
```

After editing a file:
```bash
node .claude/skills/develop-dbt/driver.mjs validate <file_path>
```

After significant changes:
```bash
node .claude/skills/develop-dbt/driver.mjs compile
```

## Commands

### validate `<file>`

Validate a single dbt YAML or SQL file without running the full project. Checks for:
- **YAML files**: Proper structure (models/sources/macros section present)
- **SQL files**: Matching Jinja brackets and variables

**Examples:**
```bash
node .claude/skills/develop-dbt/driver.mjs validate models/example/schema.yml
node .claude/skills/develop-dbt/driver.mjs validate macros/cents_to_dollars.sql
node .claude/skills/develop-dbt/driver.mjs validate models/learning_macros/my_model.sql
```

Use this after editing a file to catch errors before running full validation.

### parse

Parse the entire dbt project without compiling. This validates:
- YAML structure in all `schema.yml` files
- Model/macro/source definitions
- Ref and source relationships
- Project configuration

**Usage:**
```bash
node .claude/skills/develop-dbt/driver.mjs parse
```

Run this before substantial changes or after adding new YAML definitions.

### compile

Compile all models to validate SQL syntax and Jinja templates. This:
- Checks SQL syntax
- Validates all Jinja2 template logic
- Ensures model references (`ref()`, `source()`) are valid
- Writes compiled SQL to `target/compiled/`

**Usage:**
```bash
node .claude/skills/develop-dbt/driver.mjs compile
```

Run this after making SQL changes or adding complex Jinja logic.

### docs

Generate dbt documentation from YAML definitions and docstring comments:
```bash
node .claude/skills/develop-dbt/driver.mjs docs
```

This creates documentation in `target/compiled/index.html` but does not require database access.

### models

List all models in the project:
```bash
node .claude/skills/develop-dbt/driver.mjs models
```

Shows model names, paths, and basic metadata.

### macros

List all macros in the project:
```bash
node .claude/skills/develop-dbt/driver.mjs macros
```

Shows macro names and paths.

### help

Show command reference:
```bash
node .claude/skills/develop-dbt/driver.mjs help
```

## Development Workflow

When **creating a new model** in `models/learning_macros/`:

1. Create the SQL file
2. Validate syntax:
   ```bash
   node .claude/skills/develop-dbt/driver.mjs validate models/learning_macros/my_new_model.sql
   ```
3. Add YAML docs to `models/learning_macros/schema.yml`
4. Validate YAML:
   ```bash
   node .claude/skills/develop-dbt/driver.mjs validate models/learning_macros/schema.yml
   ```
5. Parse project to check references:
   ```bash
   node .claude/skills/develop-dbt/driver.mjs parse
   ```
6. Compile to validate SQL:
   ```bash
   node .claude/skills/develop-dbt/driver.mjs compile
   ```

When **editing an existing model**, run:
```bash
node .claude/skills/develop-dbt/driver.mjs validate <file>  # Quick syntax check
node .claude/skills/develop-dbt/driver.mjs compile           # Full validation
```

When **adding a macro**, update `macros/_macros_docs.yml` with documentation and run:
```bash
node .claude/skills/develop-dbt/driver.mjs validate macros/_macros_docs.yml
```

## Key Points

- **No database required**: All commands run locally without BigQuery or other warehouse connections
- **Fast feedback**: `validate` is the quickest way to catch errors in individual files
- **Parse before compile**: `parse` is faster than `compile` and catches most structural issues
- **YAML formatting**: Ensure 2-space indentation in all `.yml` files
- **Jinja syntax**: Balance all `{% if %}...{% endif %}` and `{{ ... }}` pairs

## Gotchas

- **dbt-env activation**: The driver automatically activates the `dbt-env/` virtual environment. If it's not present, the driver will fail.
- **Relative paths**: File paths in commands should be relative to the project root, not the skill directory
- **YAML indentation**: dbt is sensitive to indentation. Use exactly 2 spaces, no tabs.
- **schema.yml must exist**: Every model directory should have a `schema.yml` file. If missing, add one with at least:
  ```yaml
  version: 2
  models: []
  ```

## Troubleshooting

**Error: "dbt: command not found"**
- The `dbt-env/` directory may be missing or the virtual environment is corrupt.
- Recreate it: See the main CLAUDE.md for environment setup.

**Error: "Mismatched Jinja blocks"**
- Count opening `{% if %}`, `{% for %}`, `{% macro %}` tags.
- Ensure each has a corresponding closing tag: `{% endif %}`, `{% endfor %}`, `{% endmacro %}`.

**Error: "YAML validation failed"**
- Check indentation (2 spaces, no tabs).
- Ensure `schema.yml` files have a top-level `version: 2` and either `models:`, `sources:`, or `macros:` section.

**models/compile fails with "Model X references undefined source"**
- Check that all `source()` calls match sources defined in a `sources/` subdirectory's `schema.yml`.
- Verify spelling and case sensitivity.

**"File not found" error**
- Provide paths relative to the project root, e.g., `models/example/my_model.sql`, not `/absolute/path/`.
