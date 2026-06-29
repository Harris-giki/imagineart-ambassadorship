# Design System Guidelines

This kit defines the **visual system** — navbar, footer, FAQ, typography, and
colors — for the marketing site. Follow it on any new page so everything stays
consistent. The content of a page (its words, sections, images) changes per
page; **the system in this document does not.** Reuse the tokens and components
here — never invent new colors, weights, or fonts.

> TL;DR of the hard rules
> - ❌ **No bold fonts.** Max weight is `font-semibold` (600). Never `700+`.
> - 🎨 **Primary = black, secondary = white (with black text).** Purple
>   (`#8A3FFC`) is an **accent only — use it sparingly**, never as a primary
>   surface or default. No other hues (no orange, blue, green, teal…).
> - ✅ Use the semantic CSS variables from `tokens/globals.css`, not raw hexes.
> - ✅ Headings are **Title Case** (`capitalize`), body is sentence case.
> - ✅ One font family everywhere: **Google Sans Flex**.

**Adapting to your page:** the components ship with placeholder content (nav
link labels, footer columns, CTA text, FAQ copy). Swap that content for whatever
your page needs — but keep the structure, classes, tokens, and rules below
unchanged. The look stays the same; only the words change.

---

## 1. Colors

### Hierarchy — read this first
The palette is **monochrome with one accent**:

1. **Primary — black** (`#171717`). The dominant UI color: primary buttons/CTAs
   (near-black fill, white text), primary text, the dark footer, and the
   scrolled-navbar glass.
2. **Secondary — white** (`#fff`), with **black text**. The default page and
   card surface. Most of the page is white-on-black-text.
3. **Accent — purple** (`#8A3FFC`). Used **sparingly** for small highlights only:
   the brand mark, a small active/hover detail, a progress bar, a focus ring.
   **Never** the background of a section, never a primary button, never large
   fills or body text.

> ⚠️ Token-naming gotcha: in `tokens/globals.css` the Tailwind ramp **named
> `primary-*` is the PURPLE accent ramp** (`primary-60` = `#8A3FFC`). That name
> refers to "brand primary color," **not** the UI primary. The UI primary is
> **black** — use `content-primary` (text) and the near-black button fill, not
> `primary-60`, when you want "primary."

All colors are defined as CSS variables in `tokens/globals.css` under `@theme`.
Use the **semantic tokens** via Tailwind classes (`text-content-primary`,
`bg-surface-primary`, and `text-primary-60` *only* for the purple accent). Do
not hardcode hexes except for the documented one-offs in the kit (e.g. footer
background `#070707`).

### The palette

| Role | Token | Value |
|------|-------|-------|
| **Primary (black)** — text & dark fills | `--color-content-primary` | `#171717` |
| **Secondary (white)** — page/card surface | `--color-background` / `--color-surface-primary` | `#fff` / `rgb(250 250 250)` |
| Secondary text (grey) | `--color-content-secondary` | `rgb(87 87 87)` |
| Tertiary text | `--color-content-tertiary` | `rgb(0 0 0 / 0.5)` |
| **Accent (purple)** — sparing | `--color-primary-60` | `#8A3FFC` |
| Accent hover/darker | `--color-primary-70` | `rgb(112 42 214)` |
| Accent gradient | `--color-brand-from` → `--color-brand-to` | `#a874ff` → `#7a2ef0` |
| Borders | `--color-border-primary` | `rgb(0 0 0 / 0.08)` |
| Footer background | (one-off) | `#070707` |

There is a full **purple accent ramp** `primary-10 … primary-100` and a
**neutral ramp** `neutral-10 … neutral-110` for tints/shades. Pick from those —
do not eyeball a new value.

### ✅ Do
- Build with **black + white**: black text and CTAs on white surfaces; the dark
  footer/navbar as the only dark areas. This is the default look.
- Use **purple only as a small accent** — brand mark, a hover/active detail, a
  progress bar, a focus ring. A page should read as black-and-white with the
  occasional purple touch.
- Express soft tints with **opacity on black/white** (`text-white/55`,
  `bg-black/[0.04]`) rather than new grey hexes.
- Separate sections with `border-t border-border-primary`, not color blocks.

### ❌ Don't
- **Don't treat purple as primary.** No purple section backgrounds, no purple
  primary buttons, no purple body text, no large purple fills.
- **No new hues.** No orange, blue, green, pink, yellow, teal. If you're reaching
  for a color that isn't black / white / neutral grey / the purple accent, stop.
- Don't hardcode arbitrary hexes (`#7c3aed`, `#3b82f6`, …). If a value isn't in
  `globals.css`, it doesn't belong on the page.
- Don't use a second saturated color for error/success states inline — keep the
  single purple accent; communicate state with copy/icons, not new colors.
- Don't put colored text on colored backgrounds. Black on white, white on the
  dark footer, purple used only as a small touch.

---

## 2. Typography

**One typeface: Google Sans Flex** (variable font, see `fonts/`). It powers both
`--font-sans` (body) and `--font-display` (headings). A mono stack
(`--font-mono`) is used only for tiny eyebrow labels.

### Weights — the most important rule
Use **four weights only**:

| Weight | Tailwind | Used for |
|--------|----------|----------|
| 300 Light | `font-light` | large mobile-menu links |
| 400 Regular | `font-normal` | body copy, paragraphs |
| 500 Medium | `font-medium` | nav links, buttons, labels, hero headline |
| 600 Semibold | `font-semibold` | section headings (H2/H3), eyebrows |

- ❌ **Never use `font-bold` (700) or heavier.** Headings top out at semibold.
- ❌ Never use `<strong>` for visual weight beyond `font-medium`/`font-semibold`
  (set the weight explicitly when you do use `<strong>`).

### Case & style
- **Headings (H1, H2, H3): Title Case**, applied with the Tailwind `capitalize`
  class. Not sentence case, not ALL CAPS.
  - *Exception:* a heading written as a conversational **question** stays
    sentence case (see the FAQ heading).
- **Body copy: sentence case.**
- **Eyebrows / kickers:** small mono, **UPPERCASE**, wide tracking — this is the
  *only* place uppercase is allowed. Pattern:
  `font-mono text-[10.5px] font-semibold tracking-[1.8px] uppercase text-content-tertiary`.
- Headings use **tight negative letter-spacing** (`tracking-[-0.5px]`) and tight
  line-height (`leading-[1.05]`).
- Body uses relaxed line-height (`leading-[1.7]`) and a hair of negative
  tracking (`tracking-[-0.005em]`).

### Type scale (from `globals.css`)
Headings are set with `clamp()` for fluid sizing. Common patterns in use:
- Section H2: `clamp(32px, 4vw, 52px)`, `font-semibold`, `capitalize`.
- Card H3: `clamp(20px, 2.2vw, 30px)` or fixed `text-[20px]`, `font-semibold`.
- Body: `text-[15px]`–`text-[18px]`, `leading-[1.7]`.
- A full token scale (`--text-display-md`, `--text-heading-2xl`, `--text-body-*`)
  exists in `globals.css` — prefer it for new components.

### ✅ Do
- Use `font-display` for headings, `font-sans` for everything else.
- Let two-tone headings carry emphasis with color, not weight — e.g. a muted
  second clause: `<span className="text-black/35">…</span>`.

### ❌ Don't
- Don't introduce a second font family (no Inter/Roboto/etc. — Google Sans Flex
  already falls back to Inter/system).
- Don't bold things to make them stand out. Use color, size, or spacing.
- Don't uppercase headings or body. Uppercase is for mono eyebrows only.

---

## 3. Navbar (`components/SiteNav.tsx`)

A `fixed` top header that **morphs on scroll**:
- **At top:** transparent, dark text (`rgba(0,0,0,0.65)`), full-width.
- **Scrolled (>20px):** collapses into a centered **dark glass pill**
  (`rgba(10,10,11,0.72)` + `backdrop-blur`), white text, logo inverts to white.
- Smooth transition via `cubic-bezier(0.22,1,0.36,1)`.
- Desktop: logo · centered links · single CTA.
- Mobile (`<lg`): hamburger → full-screen white overlay menu (large `font-light`
  links).

The link labels and CTA text shipped here are **placeholders** — replace them
with your page's sections. Keep the structure and one primary CTA.

### ✅ Do
- Keep it `z-[60]`, fixed, with the scroll-driven light→dark behavior intact.
- Keep nav links at `text-[14px] font-medium` with the subtle hover bg.
- Keep exactly one primary CTA in the bar.

### ❌ Don't
- Don't add a second bright button or a colored nav background.
- Don't make links bold or uppercase.

---

## 4. Footer (`components/SiteFooter.tsx`)

A dark footer (`bg-[#070707]`) with:
- A brand column (logo + optional app/secondary buttons).
- A responsive **link grid** (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-6`).
- A large faint SVG **watermark**.
- A bottom bar: copyright + utility button + social icons.

Text is white at **low opacity** (`text-white/55`, headings `text-white/[0.38]`,
copyright `text-white/25`), brightening on hover. Column headings are
`text-[11px] font-semibold tracking-[0.5px]` kickers.

The column links and brand assets shipped here are **placeholders** — swap them
for your site's real links, but keep the grid, opacities, and dark surface.

### ✅ Do
- Keep all footer text as low-opacity white on `#070707`.
- Keep links muted → brighten on hover (`hover:text-white/90`).
- Max content width `1240px`, padding `px-5 md:px-10`.

### ❌ Don't
- Don't use solid colored text or accent colors in the footer (the purple accent only if a
  CTA is genuinely needed — usually none).
- Don't bold footer links.

---

## 5. FAQ section (`components/FaqSection.tsx`)

A **two-column** section: a heading block on the left, an accordion list on the
right. Pattern:

```
section#faq (border-t border-border-primary)
└ .container-page
  └ py-16 md:py-24, flex-col lg:flex-row, gap-10 lg:gap-20
    ├ Left  (lg:w-[360px], shrink-0): H2 + one-line subtext
    └ Right (flex-1): accordion rows, each border-b border-border-primary
```

### Layout
- **Desktop (`lg`+):** heading column fixed at `360px` on the left, accordion
  fills the rest. Big `gap-20` between them.
- **Mobile:** stacks — heading on top, accordion below.
- Heading: `clamp(36px, 4vw, 52px)`, `font-semibold`, two-tone (second word
  muted via `text-black/35`). This H2 is **sentence case** because it reads as a
  question — questions and the literal FAQ question text stay sentence case.
- Subtext: `text-[17px] text-content-secondary max-w-[36ch]`.

### Accordion rows (`FaqRow`)
- Each row separated by a hairline `border-b border-border-primary` (and the
  list has a `border-t` on top, so dividers wrap the whole stack).
- **Row trigger** is a full-width `<button>` (`py-6`, `text-left`,
  `aria-expanded`) with the question on the left and a **circular ± icon** on the
  right (`w-8 h-8 rounded-full bg-black/[0.05]`). The vertical bar of the plus
  collapses (`scaleY(0)` + fade) to become a minus when open.
- Question text: `font-medium`, `clamp(16px, 1.4vw, 19px)`, `leading-snug`.
- **Expand/collapse** uses the **CSS grid-rows trick** for height animation —
  `grid-template-rows: 0fr → 1fr` with `transition: grid-template-rows 280ms`,
  inner wrapper `overflow-hidden`. (No JS height measuring, no max-height hacks.)
- Answer: `text-[16px] leading-[1.75] text-content-secondary max-w-[72ch] pb-6`.
- Rows reveal-stagger in (`delay={i * 60}`).

### SEO
- The section emits **FAQPage JSON-LD** (`@type: FAQPage`) built from a FAQ data
  array. Keep this when you reuse the section — it's a real SEO win. Source the
  questions from a typed data file (e.g. `lib/data/faq.ts`), not inline JSX.

### ✅ Do
- Keep the two-column layout, hairline dividers, circular ± toggle, and the
  grid-rows height animation.
- Keep questions/answers in **sentence case**.
- Keep the JSON-LD in sync with the visible Q&A.

### ❌ Don't
- Don't box each row in a card or add background fills — it's a clean divided
  list, not chips.
- Don't bold the questions (they're `font-medium`) or the answers.
- Don't animate with `max-height` guesses; use the `grid-template-rows` pattern.
- Don't introduce a colored expand icon — it's neutral black on a faint grey
  circle.

---

## 6. Buttons (`components/Button.tsx`)

Shared primitive with four variants, all `rounded-[10px] font-medium`:
- `brand` — near-black bg, white text (primary CTA).
- `white` — white bg, subtle border + shadow.
- `ghost` — transparent, bordered.
- `muted` — light grey `#EDEDED` bg.

Sizes `md` / `lg`. Never restyle a button to a new color — pick a variant.

---

## 7. Shared conventions
- **Container width:** `1240px` max, gutters `32px` desktop / `20px` mobile
  (`.container-page` in `globals.css`).
- **Corners:** generous radii (`rounded-2xl`, `rounded-3xl` for cards;
  `rounded-[10px]`/`[22px]` for buttons/pills).
- **Shadows:** soft and low-opacity only (e.g. `shadow-[0_2px_16px_rgba(0,0,0,0.045)]`).
  No hard or colored drop shadows.
- **Borders:** hairline `border-border-primary` (`rgb(0 0 0 / 0.08)`).
- **Motion:** subtle reveal-on-scroll and ease-out transitions; respect
  `prefers-reduced-motion` (see `.reveal` + media query in `globals.css`).
- **Section rhythm:** eyebrow (mono uppercase) → heading (Title Case) → body.

---

## How to use this kit on a new page
1. Drop `tokens/globals.css` in (or merge its `@theme` block) — it's the single
   source of truth for colors, fonts, and the type scale.
2. Wire the font exactly as in `fonts/layout-font-setup.tsx`.
3. Reuse `components/SiteNav.tsx`, `SiteFooter.tsx`, and `FaqSection.tsx` —
   **replace the placeholder content** (link labels, columns, CTA text, Q&A)
   with your page's, and fix import/asset paths (assets are in `assets/`).
4. For any new UI: pull colors from the tokens, keep weights ≤ 600, headings in
   Title Case, accent in purple only.
