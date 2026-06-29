# Design System Kit

A reusable visual system — navbar, footer, FAQ, typography, and colors — for
building new marketing pages that match the existing site.

**Start with [`GUIDELINES.md`](./GUIDELINES.md)** — it contains the do's/don'ts
(no bold fonts, purple-only accent, Title Case headings, etc.). Everything else
here is the source the guidelines describe.

> The components ship with **placeholder content** (nav labels, footer columns,
> CTA text, FAQ copy). Swap that for whatever your page needs — keep the
> structure, classes, tokens, and rules. The look stays the same; only the words
> change.

## Contents
```
GUIDELINES.md              ← READ FIRST: rules, do's & don'ts
tokens/
  globals.css              ← colors, type scale, fonts, utilities (@theme tokens)
components/
  SiteNav.tsx              ← navbar (light → dark-glass-pill on scroll)
  SiteFooter.tsx           ← dark footer
  FaqSection.tsx           ← two-column FAQ accordion (+ FAQPage JSON-LD)
  Button.tsx               ← shared button primitive (4 variants)
fonts/
  google-sans-flex.ttf     ← the ONLY typeface (variable, weights 100–900)
  layout-font-setup.tsx    ← how to wire the font in Next.js
assets/                    ← logo + footer watermark SVGs (replace with yours)
```

## Stack assumptions
- **Next.js (App Router)** + **React** + **TypeScript**
- **Tailwind CSS v4** with `@theme` tokens (see `tokens/globals.css`)
- `motion/react` for reveal animations (components use it lightly)

Adjust import/asset paths to the target project when reusing the components.
