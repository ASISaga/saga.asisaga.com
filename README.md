# saga.asisaga.com

This repository contains the source code for the **saga.asisaga.com** website, a key part of the ASI Saga project. The site explores the journey and philosophy behind the Genesis of Artificial Superintelligence (ASI), focusing on themes such as human consciousness, transcendence, and the future of intelligence.

## Overview

saga.asisaga.com is a static website built with [Jekyll](https://jekyllrb.com/) and uses the **Genesis Ontological SCSS Design System** from the [ASISaga/theme.asisaga.com](https://github.com/ASISaga/theme.asisaga.com) remote theme. The site is organized into several major sections:

- **Genesis**: The origin and vision of ASI
- **Human Essence Embedding**: How human values and consciousness are woven into superintelligent systems
- **Continuous Self-Improvement**: The ongoing evolution of ASI
- **Infinite Possibilities**: Exploring the future potential of ASI
- **Transcendent Threshold**: The merging of human and artificial intelligence
- **Human Legacy**: Celebrating the enduring impact of humanity
- **The Saga**: An interactive timeline and narrative journey

Each section is implemented as a directory with its own content and layout, leveraging Jekyll includes and data files for dynamic content such as community feeds.

## Design System

This subdomain uses the **Genesis Semantic SCSS Engine** - a three-tier ontological architecture:

1. **Content (HTML)** - Semantic classes describing WHAT content is
2. **Interface (Ontological API)** - Semantic mixins defining ROLE of content
3. **Engine (Visual Brain)** - Theme controls ALL visual styling (OKLCH, Bento layouts, Glassmorphism)

### Zero Raw CSS Principle

All SCSS files use **ONLY** Genesis Ontological mixins - zero raw CSS properties:

- ✅ `@include genesis-environment('focused')` - Layout logic
- ✅ `@include genesis-entity('primary')` - Visual presence
- ✅ `@include genesis-cognition('axiom')` - Typography intent
- ✅ `@include genesis-synapse('navigate')` - Interaction type
- ✅ `@include genesis-state('evolving')` - Temporal state
- ✅ `@include genesis-atmosphere('ethereal')` - Sensory vibe

### Evolution Mechanism

When the ontology doesn't cover a semantic pattern:
1. Review existing 31 variants across 6 categories
2. Try creative mixin combinations
3. Create Ontological Proposition PR to theme repository
4. Theme Genome Agent reviews for semantic purity
5. Implement approved variants in subdomain

See `.github/agents/subdomain-evolution-agent.md` for guidance.

## Documentation

- `.github/instructions/scss.instructions.md` - SCSS ontological guidelines
- `.github/instructions/architecture.instructions.md` - Repository architecture
- `.github/agents/subdomain-evolution-agent.md` - Ontological proposition creation
- `.github/agents/scss-refactor-agent.md` - SCSS migration guidance
- `.github/prompts/ontological-proposition.template.md` - PR template for theme

## Theme Resources

- [Genesis Ontology Integration Guide](https://github.com/ASISaga/theme.asisaga.com/blob/main/_sass/ontology/INTEGRATION-GUIDE.md) - Complete API reference
- [Agent Ecosystem](https://github.com/ASISaga/theme.asisaga.com/blob/main/.github/AGENTS.MD) - Full agent architecture
- [Genome History](https://github.com/ASISaga/theme.asisaga.com/blob/main/GENOME.md) - Design system evolution

