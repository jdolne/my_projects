---
description: "Save project knowledge as repository memory that I will follow in future instructions"
name: "Save Repository Memory"
argument-hint: "What project knowledge should I remember? (patterns, conventions, solutions, commands)"
agent: "agent"
model: GPT-5 mini (copilot)
---

# Save Repository Memory

I'll help you capture important project knowledge as repository memory. This will guide my behavior on all future tasks in this workspace.

## What to Share

Provide any of the following that apply to this project:

- **Naming conventions**: How files, functions, variables should be named
- **Code patterns**: Recurring architectural decisions or design patterns
- **Build/run commands**: How to build, test, or run this project
- **Testing strategies**: Testing patterns and best practices used here
- **File structure**: Important directories and their purposes
- **Frameworks/tools**: Key technologies and their configuration
- **Data flow**: How data moves through the system
- **Common issues**: Known gotchas and how to avoid them
- **Dependencies**: Important libraries, APIs, or external systems
- **Team conventions**: Guidelines or standards for this project

## Format

I'll organize what you share into a clear, concise memory file at `.memories/repo/` that persists with your workspace. The format will be:

```markdown
# Project Knowledge

## Category
- Item 1
- Item 2
```

## Example

If you say:
> "In our dbt project, we always prefix staging models with 'stg_', use underscore_case for naming, and test all models with unique and not_null constraints"

I'll create a memory file capturing those conventions, then follow them automatically.

---

**Ready?** Tell me what project knowledge you'd like me to remember, or ask me to document existing patterns I should follow.
