# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **dbt (data build tool)** project for dbt development. The project uses BigQuery as the data warehouse and dbt version 1.11.9. It demonstrates various dbt concepts including models, macros, packages, and custom transformations.

## Project Structure

- **models/** - dbt models organized by project area:
  - `example/` - Basic dbt model examples (materialized as tables)
  - `learning_macros/` - Models that demonstrate custom macros
  - `learning_packages/` - Models using dbt packages
  - `person_project/` - Project-specific models
  - `sources/` - Source definitions for raw data
  
- **macros/** - Jinja2 SQL macros for reusable transformations:
  - `cents_to_dollars.sql` - Custom macro that converts amounts in cents to dollars
  - `_macros_docs.yml` - Documentation for macros
  
- **seeds/** - CSV files for loading static reference data (e.g., `snowflake_contract_rates.csv`)
  
- **tests/** - dbt test definitions (currently minimal, tests should be added to `models/example/schema.yml`)
  
- **dbt_documentation/** - Learning materials and documentation about dbt concepts
  
- **dbt_packages/** - External dbt packages (dbt_utils, dbt_artifacts, codegen, dbt_bigquery_monitoring)

## Configuration

- **dbt_project.yml** - Project configuration specifying paths, profiles, and model materializations
- **packages.yml** - External package dependencies
- **profiles.yml** (not in repo) - Database connection configuration (expected in ~/.dbt/)
- **.vscode/settings.json** - VSCode configuration pointing to the dbt-env Python environment

## Environment Setup

The project uses a Python virtual environment (`dbt-env/`) with dbt installed. The VSCode settings are configured to use:
```
/Users/jachwadolne/Desktop/Code\ Folder/my_projects/dbt-env/bin/python3
```

If dbt commands fail, ensure the virtual environment is activated or use the full path to the dbt binary.

## dbt Development

For creating, editing, and validating dbt artifacts (models, macros, tests, sources, `schema.yml`), use the **develop-dbt** skill in `.claude/skills/develop-dbt/`. It owns this project's authoring conventions and a local validation workflow (`parse`, `validate`, `compile`, `list`) that runs without touching BigQuery.

Commands that run against the warehouse (not covered by the skill):
```bash
dbt run                          # Build all models
dbt run --select model_name      # Build a specific model
dbt test                         # Run tests
dbt build                        # Run models + tests in DAG order
dbt seed                         # Load CSV seed files
dbt docs generate                # Build documentation (then `dbt docs serve`)
dbt debug                        # Check the warehouse connection and config
```
Run dbt from the `dbt-env/` virtualenv (see Environment Setup).

## Installed Packages

- **dbt_utils** (1.3.3) - Utility functions and macros
- **dbt_artifacts** (2.10.1) - Metadata and lineage information
- **codegen** (0.14.1) - Auto-generate model SQL
- **dbt_bigquery_monitoring** (0.26.0) - BigQuery cost and performance monitoring models

To use macros from packages, call them as `{{ package_name.macro_name(...) }}`.

## Key Notes

- The project is a learning repository focused on demonstrating skill; some directories (like `tests/`) are mostly empty
- dbt-core version 1.11.9 is installed but future versions are available (1.11.11 is the latest)
- BigQuery is the target database (referenced in packages)
- dbt authoring conventions and local validation live in the **develop-dbt** skill (`.claude/skills/develop-dbt/`)
