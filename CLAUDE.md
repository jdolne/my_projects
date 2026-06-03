# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **dbt (data build tool)** project for dbt development. The project uses BigQuery as the data warehouse and dbt version 1.10.20. It demonstrates various dbt concepts including models, macros, packages, and custom transformations.

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

## Common dbt Commands
This is not a comprehensive list.

**Run and test:**
```bash
dbt run                          # Execute all models
dbt run --select model_name      # Execute a specific model
dbt test                         # Run all tests
dbt test --select source:source_name  # Test specific sources
dbt build                        # Run models + tests in DAG order
```

**Development & debugging:**
```bash
dbt compile                      # Parse and compile models (useful for syntax checking)
dbt parse                        # Parse YAML files
dbt debug                        # Check database connection and dbt configuration
dbt freshness                    # Check data source freshness
```

**Cleaning & setup:**
```bash
dbt clean                        # Remove target/ and dbt_packages/
dbt seed                         # Load CSV seed files
```

**Documentation:**
```bash
dbt docs generate               # Generate documentation
dbt docs serve                  # Serve documentation at http://localhost:8000
```

## Writing Models

Models are SQL files in `models/` that transform raw data. Key patterns:
- Models are materialized based on config in `dbt_project.yml` or `{{ config(...) }}` macro
- Example models use Jinja2 for control flow, loops, and templating
- Use source definitions in `schema.yml` to reference raw data
- Add comprehensive tests and documentation in the corresponding `schema.yml` file
- Model columns should all be listed within the `schema.yml` file

## Writing Tests

Tests should be defined in `models/[subdirectory]/schema.yml` under the `models:` or `sources:` keys:
```yaml
models:
  - name: my_model
    columns:
      - name: id
        tests:
          - unique
          - not_null
```

Reference packages to create tests or create custom test SQL files in `tests/` directory.

## Custom Macros

Add new macros to the `macros/` directory with corresponding documentation in `_macros_docs.yml`. If a task is likely to be repeated, in another model, create a macro.

## Installed Packages

- **dbt_utils** (1.3.3) - Utility functions and macros
- **dbt_artifacts** (2.10.1) - Metadata and lineage information
- **codegen** (0.14.1) - Auto-generate model SQL
- **dbt_bigquery_monitoring** (0.26.0) - BigQuery cost and performance monitoring models

To use macros from packages, call them as `{{ package_name.macro_name(...) }}`.

## Key Notes

- The project is a learning repository focused on demonstrating skill; some directories (like `tests/`) are mostly empty
- dbt-core version 1.10.20 is installed but future versions are available
- Models should be configured as views.
- BigQuery is the target database (referenced in packages)
- Changes to `schema.yml` files require running `dbt parse` to validate YAML structure
