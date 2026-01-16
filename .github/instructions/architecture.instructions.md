---
applyTo: "**/*"
description: "Repository architecture, companion-file roles, integration points, and agent responsibilities for the subdomain."
---

# Companion File Structure & Repository Architecture

This file documents the companion-file codex and how agents should interpret the repository structure.

- **README.md** — Human-facing entry point. Quick start, project overview, and contribution guide.
- **.github/instructions/website.instructions.md** — Site-level conventions (SCSS/JS), layout rules, and UX implementation guidance.
- **.github/instructions/ux.instructions.md** — High-level UX philosophy, accessibility rationale, tone, and design patterns.
- **.github/instructions/testing.instructions.md** — Testing philosophy, conventions, and CI/CD hooks.
- **.github/instructions/html.instructions.md** — Template and Jekyll/Liquid guidance, include rules, and accessibility checks.
- **.github/instructions/js.instructions.md** — JS entry, asset ordering, vendor rules, and HTML-in-JS scans.
- **.github/instructions/scss.instructions.md** — SCSS partial mapping, import chains, and linting guidance.
- **.github/agents/** — Role-focused agent files (lint-agent.md, api-agent.md, docs-agent.md, test-agent.md, etc.).


Each file is atomic: it covers one domain of guidance. Together, they form a codex for both humans and Copilot agents.

## Repository layout (agent interpretation)

- `Website/` — contains all subdomain sites and a local clone of the shared theme. Agents should treat `Website/` as the root for site-level checks.
- `Website/<subdomain>.asisaga.com/` — subdomain content: `_includes`, `_layouts`, `_sass`, `assets`, `scripts`, and CI hooks.
- `Website/theme.asisaga.com/` — canonical theme source; changes here usually require coordinated PRs across subdomains.

## Integration points (high level)

- **Theme coordination (overview):** Changes that affect shared layout, tokens, or build-time behavior typically require coordinated PRs across the theme and subdomain repositories.
- **Vendor flow (overview):** Vendor artifacts are prepared locally and committed under vendor directories in `assets` or `_sass/vendor` for reproducible builds.
- **CI hooks:** Automated checks should be wired into the repository's CI (GitHub Actions) and may call Buddhi/MCP tools for heavier audits.

For specific guidance on templates, accessibility, component mappings, SCSS conventions, and JS vendor/initialization rules, consult the focused instruction files below rather than duplicating their content here:

- `.github/instructions/html.instructions.md` — HTML, Jekyll/Liquid templates, includes, accessibility, and template-level checks.
- `.github/instructions/scss.instructions.md` — SCSS partial mapping, import chain, theming, vendor handling, and stylelint guidance.
- `.github/instructions/js.instructions.md` — JS entry points, vendor flow, runtime initialization, and forbidden patterns.

## Buddhi / MCP guidance

For Buddhi/MCP-specific agent behavior and operational guidance (agent prompt contracts, execution mapping, and interaction patterns), see: `.github/agents/buddhi-agent.md`.

## Agent responsibilities (architecture-specific)

Agents should consult the domain-specific instruction files listed above when performing validation related to HTML templates, SCSS partials, or JS assets. High-level responsibilities remain:

- Validate site structure and that overrides are intentional and documented.
- Ensure cross-repo coordination for breaking changes to shared theme artifacts.
- Invoke Buddhi/MCP tooling for heavy audits and provide an invocation artifact under `.github/prompts/` when required.
- **Ontological SCSS compliance**: Verify subdomain SCSS contains zero raw CSS properties and uses only Genesis Ontological mixins.
- **Evolution facilitation**: When semantic gaps are identified, guide creation of Ontological Propositions to theme repository.

## Genesis Ontological Design System - Evolution Mechanism

This subdomain uses the **Genesis Semantic SCSS Engine** from the theme repository. The system operates as a "Living Genome" that evolves through AI-human collaboration.

### Subdomain Role in Evolution

When the existing ontology doesn't cover a semantic pattern:

1. **Identify gaps** - Recognize when NO combination of existing mixins achieves semantic intent
2. **Propose evolution** - Create well-formed Ontological Proposition PRs to theme repository
3. **Implement approved variants** - Use new semantic variants once theme approves and implements

### Agent Ecosystem

- **Subdomain Evolution Agent** (`.github/agents/subdomain-evolution-agent.md`) - Creates ontological propositions
- **SCSS Refactor Agent** (`.github/agents/scss-refactor-agent.md`) - Migrates legacy CSS to ontological system
- **Theme Genome Agent** (theme repository) - Reviews propositions, maintains semantic purity

### Key Resources

- **Theme INTEGRATION-GUIDE.md** - Complete API reference for all 31 ontological variants
- **Theme AGENTS.MD** - Full agent ecosystem architecture and workflows
- **Theme GENOME.md** - Evolutionary history of design system variants

## Change coordination guidance

- For breaking changes to design tokens, mixins, or shared components: create a coordination issue, link PRs across theme and subdomain repos, and assign reviewers from both teams.
- Prefer additive changes in the theme (new tokens/mixins) and deprecate old tokens gradually with a clear migration path.
- Document cross-repo rationale and migration steps in PR bodies to make review and rollout deterministic.