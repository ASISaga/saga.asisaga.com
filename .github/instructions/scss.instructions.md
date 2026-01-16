---
applyTo: "**/_sass/**,**/*.scss,**/_sass/**/_*.scss"
description: "SCSS guidance for subdomain: Genesis Ontological SCSS system, partial locations, import chains, semantic mapping, and evolution mechanisms."
---

# Genesis Ontological SCSS Design System

This subdomain uses the **Genesis Semantic SCSS Engine** - a three-tier architecture that separates content semantics from visual presentation.

## Three-Tier Architecture

1. **Content (HTML)** - WHAT the data is (semantic classes)
2. **Interface (Ontological API)** - ROLE of content (semantic mixins, no CSS properties)
3. **Engine (Visual Brain)** - LOOK of content (OKLCH, Bento, Glassmorphism - theme controls)

## Golden Rule: Zero Raw CSS

**SCSS files in this subdomain must contain ZERO raw CSS properties.**

❌ **FORBIDDEN:**
```scss
.my-card {
  padding: 2rem;              // NO
  background: #1a1a2e;        // NO
  border-radius: 12px;        // NO
  color: white;               // NO
  font-size: 1.5rem;          // NO
}
```

✅ **CORRECT:**
```scss
.my-card {
  @include genesis-entity('primary');     // All styling from theme engine
  
  .card-title {
    @include genesis-cognition('axiom');  // Typography intent
  }
  
  .card-action {
    @include genesis-synapse('execute');  // Interaction type
  }
}
```

## Six Ontological Categories

All styling is mapped through semantic mixins:

1. **`genesis-environment($logic)`** - Spatial organization (distributed, focused, associative, chronological, manifest)
2. **`genesis-entity($nature)`** - Visual presence (primary, secondary, imperative, latent, aggregate, ancestral)
3. **`genesis-cognition($intent)`** - Information type (axiom, discourse, protocol, gloss, motive, quantum)
4. **`genesis-synapse($vector)`** - Interaction (navigate, execute, inquiry, destructive, social)
5. **`genesis-state($condition)`** - Temporal state (stable, evolving, deprecated, locked, simulated)
6. **`genesis-atmosphere($vibe)`** - Sensory texture (neutral, ethereal, void, vibrant)

## File Structure

- `/_sass/_main.scss` - Entry point, imports `@import "ontology/index";`
- `/_sass/pages/` - Page-specific semantic mappings (NO raw CSS)
- `/_sass/vendor/` - Vendor code (documented source and version)

## Import Chain

```scss
---
---
@import "ontology/index";  // Import Genesis Ontology from theme

// Semantic mappings (using ONLY ontological mixins)
.my-page {
  @include genesis-environment('focused');
  // ... more semantic mappings
}
```

## Mirrored Structure Principle

SCSS nesting must mirror HTML DOM hierarchy exactly:

```html
<main class="research-hub">
  <section class="intro-section">
    <h1 class="hub-title">Title</h1>
  </section>
</main>
```

```scss
.research-hub {
  @include genesis-environment('focused');
  
  .intro-section {
    @include genesis-entity('primary');
    
    .hub-title {
      @include genesis-cognition('axiom');
    }
  }
}
```

## Evolution Mechanism

When the ontology doesn't cover a semantic pattern:

1. **Review existing variants** - Check all 31 variants in theme's INTEGRATION-GUIDE.md
2. **Try combinations** - Mix ontological mixins creatively
3. **Propose evolution** - If genuine gap exists, create Ontological Proposition PR to theme
4. **Theme Agent reviews** - Semantic purity and universal applicability
5. **Implementation** - New variants documented in theme's GENOME.md

See `.github/agents/subdomain-evolution-agent.md` for detailed guidance.

## Best Practices

- **Semantic class names** - Use `.research-paper`, NOT `.blue-box`
- **Think WHAT, not HOW** - Focus on information intent, not appearance
- **One responsibility** - One primary mixin per category as needed
- **Combine mixins** - Apply multiple categories for rich semantics

## Vendor & Third-party CSS

- Vendors: `/_sass/vendor/` with documented source and version
- Import after `ontology/index` but before local mappings

## Do Not

- Do not use raw CSS properties (padding, margin, color, font-size, etc.)
- Do not copy theme `_sass` files into subdomain
- Do not think about visual appearance - think semantic roles

## Structural Checks & SCSS Scans
- **Component partial mapping:** Ensure each `_includes/components/<name>.html` has a corresponding `/_sass/components/_<name>.scss`. Missing partials should be explained in the include header.
- **Avoid deep specificity:** Warn on deeply-nested selectors (>4 levels) and global element selectors in component partials.
- **`@extend` policy (warn):** Use `@extend` sparingly. If used, document rationale in the partial header so reviewers can assess maintainability impact. CI may flag `@extend` usages for review.

## Enforcement & Linting
- **Stylelint in CI:** Run `stylelint` with the shared config in CI. Fixable issues can be suggested as edits but require a maintainer to approve committing the changes.
