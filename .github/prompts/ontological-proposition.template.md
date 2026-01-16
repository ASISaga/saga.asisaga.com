---
description: "Template for creating Ontological Propositions to theme repository"
type: "template"
target_repo: "ASISaga/theme.asisaga.com"
---

# 🧩 Ontological Proposition Template

Use this template when submitting PRs to the theme repository to propose new semantic variants.

---

## 🧩 Ontological Proposition

**Source Node**: saga.asisaga.com

**Intent (The 'What')**: 
[One clear sentence describing the semantic role this variant addresses]

**Context (The 'Why')**:
[2-3 sentences explaining why the current 31 ontological variants don't cover this semantic pattern. Reference specific existing variants you considered.]

---

## 🔭 Proposed Role

- **Type**: [Choose one: Environment | Entity | Cognition | Synapse | State | Atmosphere]
- **Suggested Label**: `[category]('[variant-name]')`
- **Relationship**: [Describe how this relates to existing variants in the same category]

---

## 📋 Use Cases

**Specific examples where this variant is needed:**

1. **saga.asisaga.com**: [Concrete example from this subdomain]
2. **[other-subdomain].asisaga.com**: [Potential usage scenario]
3. **[another-subdomain].asisaga.com**: [Potential usage scenario]

---

## 🌐 Universal Applicability

**Why other ASI Saga subdomains would use this variant:**

- **research.asisaga.com**: [How research subdomain might use this]
- **docs.asisaga.com**: [How docs subdomain might use this]
- **analytics.asisaga.com**: [How analytics subdomain might use this]
- **community.asisaga.com**: [How community subdomain might use this]

---

## 💡 Suggested Implementation (Conceptual)

```scss
/**
 * @category [Environment|Entity|Cognition|Synapse|State|Atmosphere]
 * @variant '[variant-name]'
 * @origin PR #XX (saga.asisaga.com)
 * @intent [One-line semantic purpose]
 * @since [Version]
 */
@mixin genesis-[category]($[parameter]) {
  @if $[parameter] == '[variant-name]' {
    // Purpose: [What this achieves semantically]
    // Visual suggestion: [Optional - theme controls actual implementation]
    //   Example: "Could use reduced opacity + shimmer for uncertainty"
    //   Example: "Could use elevated glassmorphism for sacred content"
  }
}
```

---

## ✅ Success Criteria

This variant succeeds if:

- [ ] **Not Redundant**: Cannot be achieved by combining existing mixins
- [ ] **Universal**: Useful across multiple ASI Saga subdomain contexts
- [ ] **Semantic**: Describes WHAT content is, not HOW it looks
- [ ] **Categorized**: Fits clearly into one of the 6 ontological categories
- [ ] **Well-Defined**: Clear examples and use cases provided

---

## 🔍 Self-Review Checklist

Before submitting, verify:

- [ ] I reviewed all 31 existing variants and their combinations
- [ ] I can articulate WHY this is a distinct semantic pattern
- [ ] At least 3 different subdomains could use this variant
- [ ] My description uses semantic language, not visual language
- [ ] I identified the correct ontological category (Environment/Entity/etc.)
- [ ] I provided concrete, realistic examples from multiple contexts

---

## 🚫 Red Flags - Reconsider If True

- ❌ Request describes visual attributes ("make it blue", "bigger font")
- ❌ Only needed for one specific page in one subdomain
- ❌ Can be achieved by combining 2-3 existing mixins
- ❌ Vague description without clear semantic distinction
- ❌ Changes to existing variant behavior (propose refactor instead)
- ❌ Requests specific CSS properties or design token values

---

## 📚 Reference

**Current Genesis Ontology (31 variants):**

1. **Environment** (5): distributed, focused, associative, chronological, manifest
2. **Entity** (6): primary, secondary, imperative, latent, aggregate, ancestral
3. **Cognition** (6): axiom, discourse, protocol, gloss, motive, quantum
4. **Synapse** (5): navigate, execute, inquiry, destructive, social
5. **State** (5): stable, evolving, deprecated, locked, simulated
6. **Atmosphere** (4): neutral, ethereal, void, vibrant

**Essential Reading:**
- Theme `_sass/ontology/INTEGRATION-GUIDE.md` - Complete API
- Theme `.github/AGENTS.MD` - Ecosystem architecture
- Theme `GENOME.md` - Evolutionary history
