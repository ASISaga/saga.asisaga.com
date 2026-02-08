# saga.asisaga.com

This repository contains the source code for the **saga.asisaga.com** website, a key part of the ASI Saga project. The site explores the journey and philosophy behind the Genesis of Artificial Superintelligence (ASI), focusing on themes such as human consciousness, transcendence, and the future of intelligence.

## Overview

saga.asisaga.com is a static website built with [Jekyll](https://jekyllrb.com/) and uses the **Genesis Ontological SCSS Design System v4.0** from the [ASISaga/theme.asisaga.com](https://github.com/ASISaga/theme.asisaga.com) remote theme. The site is organized into several major sections:

- **Genesis**: The origin and vision of ASI
- **Human Essence**: How human values and consciousness are woven into superintelligent systems
- **Continuous Improvement**: The ongoing evolution of ASI
- **Infinite Possibilities**: Exploring the future potential of ASI
- **Transcendent Threshold**: The merging of human and artificial intelligence
- **Human Legacy**: Celebrating the enduring impact of humanity
- **The Saga**: An interactive timeline and narrative journey
- **Possibilities**: Future scenarios enabled by ASI

## Architecture

This subdomain is intentionally lean, maximizing the use of shared theme includes, layouts, and components:

- **No `_includes/` directory** — All includes come from the theme (`transcendent-hero`, `section-header`, `feature-grid`, `genesis-invitation`, `cta`, `timeline`, `interactive-module`, `content-modal`, etc.)
- **Theme layouts** — Pages use `default`, `landing`, `article`, `docs`, `archive`, and `gallery` layouts from the theme
- **Front-matter driven content** — Feature grids and card data are defined in page front matter rather than custom HTML
- **Minimal SCSS** — Only subdomain-specific semantic mappings (community feeds); all visual styling via the ontology engine

## Design System

This subdomain uses the **Genesis Semantic SCSS Engine v4.0** — a three-tier ontological architecture:

1. **Content (HTML)** — Semantic classes describing WHAT content is
2. **Interface (Ontological API)** — Semantic mixins defining ROLE of content
3. **Engine (Visual Brain)** — Theme controls ALL visual styling (OKLCH, Bento layouts, Glassmorphism)

### Zero Raw CSS Principle

All SCSS files use **ONLY** Genesis Ontological mixins — zero raw CSS properties:

- ✅ `@include genesis-environment('focused')` — Layout logic
- ✅ `@include genesis-entity('transcendent')` — Sacred/mission-critical presence
- ✅ `@include genesis-cognition('axiom')` — Typography intent
- ✅ `@include genesis-synapse('invoke')` — AI/generative action triggers
- ✅ `@include genesis-state('transcending')` — Transformative transitions
- ✅ `@include genesis-atmosphere('sacred')` — Reverent sensory vibe

### v4.0 Ontological Variants

This subdomain uses the following new v4.0 variants:

| Category | Variant | Usage |
|----------|---------|-------|
| Entity | `transcendent` | Hero sections, genesis-level content |
| Atmosphere | `sacred` | Mission-critical pages (genesis, threshold) |
| State | `emerging` | Newly appearing content, pillar icons |
| State | `transcending` | Transformative transition effects |
| Synapse | `invoke` | Genesis-related CTA triggers |
| Cognition | `testimony` | Quoted/testimonial content |

## Theme Resources

- [Genesis Theme CHANGELOG](https://github.com/ASISaga/theme.asisaga.com/blob/main/CHANGELOG.md) — v4.0 Ontological Transcendence
- [Ontology Integration Guide](https://github.com/ASISaga/theme.asisaga.com/blob/main/_sass/ontology/INTEGRATION-GUIDE.md) — Complete API reference
- [Genome History](https://github.com/ASISaga/theme.asisaga.com/blob/main/GENOME.md) — Design system evolution

