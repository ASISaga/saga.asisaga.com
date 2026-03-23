---
description: "Frontend audit of saga.asisaga.com — visual issue list and theme PR proposal"
type: "audit"
date: "2026-03-21"
auditor: "frontend-skill agent"
---

# Frontend Audit: saga.asisaga.com
**Date**: 2026-03-21  
**Audited by**: frontend-skill agent (skill: composition, image hierarchy, motion, copy restraint)

---

## Visual Thesis

saga.asisaga.com should feel like a **sacred editorial journal** — cinematic, profound, deep-space cosmos with editorial precision. The first screen should read like a pull-quote on a star field: one big idea, one visual anchor, inevitable white space. Every post listing entry should feel like a chapter opening, not a grey box in a list.

---

## Issues Found

### CRITICAL

#### Issue 1 — No Visual Anchor in the Hero
**Location**: `_includes/transcendent-hero.html` → homepage  
**Description**: The hero has zero real imagery. `cosmic-particles`, `essence-streams`, and `transcendent-glow` are all empty CSS-animated divs. On any screen, the hero is an abstract gradient with text floating in void. There is no photograph, no composed image, no stable tonal plane for the copy to rest on.  
**Frontend-skill rule**: *"The first viewport needs a real visual anchor. Decorative texture is not enough."* The hero also fails: *"If the first viewport still works after removing the image, the image is too weak."* — there is no image to remove.  
**Fix required**: The `transcendent-hero.html` must accept an `image` parameter and render it as a full-bleed background with a stable dark tonal area for the text column.

---

#### Issue 2 — Blog Listing is a Generic Card Grid
**Location**: `index.html` → `.blog-post-card` using `genesis-entity('secondary')`  
**Description**: Every one of the 10 blog posts is displayed as an identical light-grey bordered card with a white background. This is precisely the "Generic SaaS card grid as the first impression" failure mode. Nothing distinguishes the latest post from a post from 6 months ago. No image, no scale difference, no featured treatment.  
**Frontend-skill rule**: *"No cards by default."* and *"Reject These Failures: Generic SaaS card grid as the first impression."*  
**Fix required**: 
1. Remove card chrome from blog listing entries — use borderless editorial rows instead.
2. Add a featured-first layout for the most recent post.
3. Surface post thumbnail images in the listing.

---

### HIGH

#### Issue 3 — Blog Card Titles Use Hero-Scale Typography (`axiom`)
**Location**: `_sass/_blog-listing.scss` → `.blog-post-card__title { @include genesis-cognition('axiom'); }`  
**Description**: The `axiom` cognition variant is `clamp(2rem, 5vw, 3.5rem)` — that is 32–56px. Using hero-scale typography for every blog card title in a list of 10 means the page screams 10 equally loud headlines simultaneously. No hierarchy, no breathing room.  
**Frontend-skill rule**: *"Make the brand or product name the loudest text."*  
**Fix required**: A new `genesis-cognition('heading')` variant is needed — a secondary heading scale (~1.25–1.75rem) distinct from `axiom`. Blog listing titles should use `heading`, not `axiom`.

---

#### Issue 4 — Post Layout Has No Feature Image
**Location**: `_layouts/post.html` in theme  
**Description**: Blog posts in front matter declare `image: /assets/images/blog/...png` but the post layout never renders it. The `transcendent-hero.html` on the post page displays a generic gradient hero regardless of whether a post has a real image. "The Three Voices of AI" and "English is the New C" both have banner images — they are silently ignored.  
**Frontend-skill rule**: *"Use at least one strong, real-looking image for editorial pages."*  
**Fix required**: Post layout should render the post's `image` front matter in the hero or as a full-bleed post header when present.

---

#### Issue 5 — Blog Listing Container Uses the Wrong Entity Type
**Location**: `index.html` → `.blog-listing .container { @include genesis-entity('primary'); }`  
**Description**: The container wrapping all blog cards uses `genesis-entity('primary')` — white background, shadow, border, padding. This creates a white "frame" panel around all the secondary-entity grey cards inside it. The result is nested surfaces with neither purpose: a framed box containing more boxes.  
**Frontend-skill rule**: *"Use whitespace, alignment, scale, cropping, and contrast before adding chrome."*  
**Fix required**: The listing container should use either no entity (let the page background show) or `genesis-entity('aggregate')` at most, and the individual entries should drop card chrome entirely.

---

#### Issue 6 — No Featured First Post
**Location**: `index.html` blog listing section  
**Description**: All 10 posts are rendered with identical weight. An editorial blog should surface the most recent post with prominence — larger title, excerpt shown in full, optional image, and clear visual separation from the rest.  
**Frontend-skill rule**: *"One dominant visual idea per section."* and *"Each section gets one job, one dominant visual idea."*  
**Fix required**: A new `genesis-environment('editorial-feed')` variant that renders the first child at full width with a featured treatment and subsequent items as condensed rows.

---

### MEDIUM

#### Issue 7 — Redundant Section Header After Hero
**Location**: `index.html` → `{% include section-header.html title="Blog" ... %}`  
**Description**: Immediately after a hero that declares "ASI Saga" and describes the blog, a section header reads "Blog" with the subtitle "Insights on consciousness, transcendence, and the future of intelligence." This subtitle directly restates the hero description.  
**Frontend-skill rule**: *"Cut repetition between sections."* and *"No filler copy."*  
**Fix required**: Remove the section header entirely, or reduce it to a minimal visual separator with no subtitle.

---

#### Issue 8 — Consciousness Indicators Add Decorative Clutter
**Location**: `_includes/transcendent-hero.html` → `.consciousness-indicators`  
**Description**: The hero renders a decorative strip: "Human Essence — ∞ — ASI Consciousness". These are empty `indicator-flow` divs with no data, used as visual ornament.  
**Frontend-skill rule**: *"No section should need many tiny UI devices to explain itself."*  
**Fix required**: Remove the consciousness indicators from the default hero or hide them via parameter — the hero title and description already carry the semantic meaning.

---

#### Issue 9 — Scroll Indicator is Filler Copy
**Location**: `_includes/transcendent-hero.html` → `.transcendent-scroll-indicator`  
**Description**: "Embark on the Genesis Journey" is design commentary, not product language.  
**Frontend-skill rule**: *"No filler copy."* and *"Do not include prompt language or design commentary into the UI."*  
**Fix required**: Replace with a bare downward chevron arrow, or remove entirely.

---

### LOW

#### Issue 10 — Missing Motion on Blog Listing
**Location**: Blog listing section  
**Description**: The blog listing has no entrance animation or scroll-reveal. Post cards appear statically, reducing the sense of depth and aliveness that the theme's ambient effects suggest.  
**Frontend-skill rule**: *"Ship at least 2–3 intentional motions."*  
**Fix required**: A `genesis-state('scroll-triggered')` application on `.blog-post-card` would give each card a subtle entrance on scroll.

---

## Summary of Required Theme Changes

| # | Type | Change |
|---|------|--------|
| 1 | Component | `transcendent-hero.html` — add `image` / `image_alt` parameters for full-bleed background |
| 2 | Component | `post.html` layout — render `page.image` as a hero when present |
| 3 | New variant | `genesis-cognition('heading')` — secondary heading scale (1.25–1.75rem) |
| 4 | New variant | `genesis-environment('editorial-feed')` — blog listing with featured-first layout |
| 5 | New variant | `genesis-entity('editorial')` — card-less editorial entry (no border/background) |
| 6 | New variant | `genesis-atmosphere('cosmic')` — deep-space background for blog sections |

The full Ontological Propositions for the theme are in the PR document: `.github/prompts/theme-pr-visual-improvements.md`
