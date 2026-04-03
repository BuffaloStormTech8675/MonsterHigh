# CLAUDE.md — MonsterHigh RPG

This file provides context and conventions for AI assistants working in this repository.

## Project Overview

**MonsterHigh** is a fan project to convert a Monster High tabletop RPG handbook into [Foundry VTT](https://foundryvtt.com/) modules. The goal is to produce playable digital content (JSON data files, Foundry module manifests, maps, and printable assets) from the source handbook.

**Current status:** Pre-alpha / planning stage. No source code or structured data files exist yet — only documentation.

## Repository Structure

```
MonsterHigh/
├── CLAUDE.md               # This file
├── README.md               # One-line project description
├── monster-high-rpg.md     # Project overview and planned component list
└── test.text               # Placeholder / scratch file (can be deleted)
```

### Planned structure (not yet created)

Based on `monster-high-rpg.md`, the project intends to contain:

```
MonsterHigh/
├── data/
│   ├── monster-types/      # Monster type JSON files
│   ├── playbooks/          # Playbook data JSON
│   ├── backgrounds/        # Background data
│   └── spells-items/       # Spells and items data
├── foundry/
│   ├── module.json         # Foundry VTT module manifest
│   ├── packs/              # Compendium packs
│   └── templates/          # Handlebars templates
├── assets/
│   ├── maps/               # School map and location images
│   └── icons/              # Token and item icons
└── print/                  # Printable PDF templates
```

## Development Workflow

### Branches

- `main` — stable/published state
- `claude/add-claude-documentation-WMO1j` — current active development branch

Always develop on the designated feature branch. Push with:

```bash
git push -u origin <branch-name>
```

### Commit conventions

Use clear, descriptive commit messages in imperative mood:
- `Add monster-types JSON schema`
- `Update werewolf playbook stats`
- `Fix compendium pack path in module.json`

### No build system yet

There are currently no build, test, or lint commands. When a build system is introduced, document it here.

## Foundry VTT Module Conventions

When Foundry VTT files are added, follow these conventions:

- **module.json** must include: `id`, `title`, `description`, `version`, `compatibility`, `packs`
- Compendium pack types expected: `Actor` (monsters/playbooks), `Item` (spells, items, backgrounds)
- JSON data files should be valid against the Foundry VTT data model for the relevant document type
- Use `kebab-case` for filenames and directory names
- Use `camelCase` for JSON property keys to match Foundry's conventions

## Data File Conventions

When creating JSON data files for game content:

- Each entity (monster type, playbook, background, spell, item) should be a separate JSON file or a well-structured entry in a collection file
- Include a `name`, `type`, and `description` field at minimum
- Stats and mechanics should match the source handbook exactly — do not invent or balance content
- Version the data files with a `version` field when schemas stabilize

## Key Context for AI Assistants

- This is a **fan/homebrew project**, not an official Mattel or Foundry product
- The source material is a physical handbook; AI assistants should not invent game mechanics — only transcribe/structure what the human provides
- Priority order: accuracy to source > Foundry compatibility > file organization
- When in doubt about game mechanics or lore, ask the user rather than guessing
- `test.text` is a scratch file and can be safely ignored or deleted
- There is no CI/CD yet; all validation is manual

## Getting Started (for future contributors)

1. Clone the repository
2. Check out the active development branch
3. Review `monster-high-rpg.md` for the current scope
4. Add data files following the conventions above
5. Test by importing into a local Foundry VTT instance
