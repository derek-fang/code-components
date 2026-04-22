# Code Components — Claude guide

This project is a **Webflow Code Components library** (React + TypeScript components published to Webflow via the Webflow CLI). It is *not* a traditional React app for end users, despite being scaffolded with Create React App.

## Project layout

- `src/*.tsx` — the React component implementation (plain React, no Webflow imports)
- `src/*.webflow.tsx` — the Webflow declaration that registers the component, defines its props panel, and sets the name/description/group shown in the Designer
- `webflow.json` — library manifest. `library.components` is a glob that picks up every `src/**/*.webflow.{js,jsx,ts,tsx}` file as a component
- `.env` — holds `WEBFLOW_API_TOKEN` (and optionally `WEBFLOW_SITE_ID`). Untracked. Already generated.

Every new component = two files: `Foo.tsx` and `Foo.webflow.tsx`.

## Component pattern

**`src/Foo.tsx`** — a normal React component. Props are typed. Use inline styles (component ships self-contained to Webflow; no external CSS pipeline).

```tsx
import * as React from "react";

interface FooProps {
  text: string;
  variant: 'Light' | 'Dark';
}

export const Foo = ({ text, variant }: FooProps) => (
  <span style={{ /* ... */ }}>{text}</span>
);
```

**`src/Foo.webflow.tsx`** — wraps it with `declareComponent` and defines the props the Designer exposes.

```tsx
import { Foo } from './Foo';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(Foo, {
  name: 'Foo',
  description: 'What this does',
  group: 'Info',           // groups components in the Designer insert panel
  props: {
    text: props.Text({ name: "Text", defaultValue: "Hello" }),
    variant: props.Variant({
      name: "Variant",
      options: ["Light", "Dark"],
      defaultValue: "Light",
    }),
  },
});
```

Common `props.*` helpers: `Text`, `Variant` (enum dropdown), plus others from `@webflow/data-types` — check the package if you need numbers, booleans, images, etc.

Interactive components (state, refs, event handlers) work fine — see `TiltCard.tsx` for a `useRef` + `useState` example with mouse handlers.

## Pushing to Webflow

Credentials live in `.env` (`WEBFLOW_API_TOKEN`). The CLI reads them automatically.

```bash
npx webflow library share
```

This is interactive — it prints the diff ("Added", "Updated", "Removed") and asks `Y/n`. To auto-confirm in an agent context, pipe a single `y` (not `yes` — that floods stdin and produces megabytes of output):

```bash
printf 'y\n' | npx webflow library share
```

On success you'll see:
```
✔ Creating code library
✔ Compiling code components
✔ Uploading files
✔ Sharing library
Code library shared successfully: https://webflow.com/dashboard/workspace/.../shared-libraries-and-templates
```

The library is then available in any site in the workspace — users add it from **Libraries → Shared Libraries** in the Designer.

## Known gotchas

- **`npx webflow library bundle` currently fails** with `[ Module Federation Manifest Plugin ]: no files found for remoteEntry chunk`. This is a pre-existing issue unrelated to any specific component — `share` works regardless, so skip `bundle` and use `share` directly to test.
- **Don't treat this as a CRA app.** `npm start` runs the default CRA dev server against `src/App.js`, which is unrelated to the components. To preview a component visually while iterating, render it in `src/App.js` temporarily — but this is optional; Webflow Designer is the real preview surface.
- **Inline styles only, in component files.** The components ship as isolated bundles; there's no shared stylesheet. Don't reach for Tailwind, CSS modules, or external CSS imports.
- **The `webflow-builder` skill is *not* for this project.** That skill produces HTML/CSS fragments for pasting into the Designer — a totally different workflow. Code Components are React, pushed via CLI. Don't invoke that skill here.

## Adding a new component — checklist

1. Create `src/ComponentName.tsx` with the React implementation + typed props
2. Create `src/ComponentName.webflow.tsx` with `declareComponent` + props panel
3. Run `printf 'y\n' | npx webflow library share` to publish
4. Verify in the Webflow Designer (workspace: SE Enterprise Workspace, library: "Derek's Code Component Library")

## Existing components

- `Badge` (group: Info) — text + Light/Dark variant

## Component ideas worth building

Good demo components generally (a) exercise the Tripfold design system (theme tokens, fluid typography, component tokens), (b) show off something Webflow's native elements can't easily do, and (c) look polished on first glance. A few directions:

**Interactive / motion**
- **Tilt Card** — 3D mouse-tilt card with gradient bg and radial glare tracking the cursor. Good showcase of `useRef` + `useState` + mouse handlers.
- **Marquee** — infinite scrolling logo/text strip with pause-on-hover. Shows CSS animation + React duplication pattern.
- **Magnetic Button** — button that subtly follows the cursor when nearby. Uses `--_components---button--*` tokens for styling.
- **Count-up Stat** — big H0-scale number that animates from 0 to target when it enters viewport (IntersectionObserver). Great showcase of fluid typography.
- **Reveal on Scroll** — wrapper that fades/slides children in as they enter viewport.

**Content layout**
- **Accordion / FAQ** — expandable Q&A rows, animated `max-height`. Uses H4 + paragraph-body + border tokens. Theme-mode aware.
- **Tabs** — horizontal tab bar + panel swap. Exercises primary-accent for active state.
- **Testimonial Card** — avatar + block-quote + name/role. Shows off the block-quote typography step.
- **Pricing Tier** — heading + price + feature list + CTA. Exercises most of the design system at once.
- **Feature Grid** — icon + eyebrow + heading + body cards. Uses card + grid-gap tokens.
- **Timeline** — vertical list of dated entries with connector line and nodes. Uses border + primary-accent tokens.

**Data / visual**
- **Progress Ring** — animated circular SVG progress indicator with label in center. Uses primary-accent for the arc.
- **Comparison Slider** — drag a handle to reveal before/after images side-by-side.
- **Mini Chart / Sparkline** — inline SVG trend line, configurable data. Good for dashboards.

**Useful utilities**
- **Copy-to-Clipboard Code Block** — syntax-highlighted snippet with a copy button. Uses secondary-background + border tokens.
- **Toast / Callout** — configurable info/success/warning box. Uses primary-accent + border-radius tokens.
- **Avatar Stack** — overlapping circles with +N overflow indicator.
- **Keyboard Shortcut Display** — renders `<kbd>`-styled keys like `⌘` + `K`. Small but polished touch.

**Guidelines when picking one**
- **Props must be flat primitives** (Text, Number, Variant, Boolean, Image, Link) — the Webflow Designer panel has no list/array prop. For N repeated items, expose a fixed number of slots (e.g. 4 Q/A pairs) and hide empties.
- **Always use Theme tokens for color** so the component adapts to Invert/Accent/Rebrand modes automatically. See the Design System Reference below.
- **Inline styles only.** No CSS imports, no Tailwind. `var(--token)` works fine inside the `style` object — the variables resolve from the host Webflow page at render time.
- **Provide sensible defaults.** The component should look good out of the box with no config — that's what people see first in the Designer's insert preview.

---

# Tripfold Demo — Design System Reference

> Source of truth for custom-coded components. Every value below is a CSS variable defined in the Webflow project. **Always reference variables by their `var(--...)` name** rather than hardcoding values — this keeps components in sync with the theme modes and any future token changes.
>
> **For Code Components in this project:** because components ship with inline styles, use `var(--token-name)` directly in `style={{ color: 'var(--colors--heading)' }}`. The CSS variables are resolved at render time by the Webflow page they're placed on. Don't hardcode hex/rgb values when a token exists.

---

## 1. How this design system is structured

The system is built on **7 variable collections**:

1. **Color** — raw primitive color palette (the old/current brand)
2. **Colors - New** — raw primitive color palette (the new/rebrand palette)
3. **Theme** — semantic color tokens that point at primitives. This collection has **3 modes** (Invert, Accent, Rebrand) — components should consume Theme variables so they automatically adapt when a mode is switched.
4. **Typography** — full type scale (H0–H6, paragraph XL/LG/Body/SM, eyebrow, block quote) with fluid sizing
5. **Border Radius** — global radius token
6. **Layout** — grid gaps, padding scale, and fluid viewport min/max
7. **Components** — component-level tokens (section, container, card, button, input)

**Key rule for component authors:** Use **Theme** variables for any color that should respond to dark/accent/rebrand mode. Only use raw Color/Colors-New variables when you explicitly need a fixed color (e.g. a brand-only illustration).

---

## 2. Fluid sizing system

Many tokens use a `clamp()` formula driven by two viewport variables:

```css
--_layout---fluid--min: 20;  /* rem → 320px viewport */
--_layout---fluid--max: 90;  /* rem → 1440px viewport */
```

Any token with a `*-min-rem` and `*-max-rem` pair interpolates linearly between those two viewport widths. Custom components should follow the same pattern for fluid values — don't hardcode media queries for type/spacing.

The generic clamp formula used throughout:

```css
clamp(
  var(--token--min-rem) * 1rem,
  ((var(--token--min-rem) - ((var(--token--max-rem) - var(--token--min-rem)) / (var(--_layout---fluid--max) - var(--_layout---fluid--min)) * var(--_layout---fluid--min))) * 1rem
    + ((var(--token--max-rem) - var(--token--min-rem)) / (var(--_layout---fluid--max) - var(--_layout---fluid--min))) * 100vw),
  var(--token--max-rem) * 1rem
)
```

---

## 3. Color primitives

### 3a. Color (original palette)

| Variable | Value |
|---|---|
| `--_color---primary--brand` | `#2581f1` (blue) |
| `--_color---neutral--white` | `white` |
| `--_color---neutral--100` | `hsla(214.84, 55.06%, 95.55%, 1)` |
| `--_color---neutral--200` | `hsla(214.84, 40.61%, 83.16%, 1)` |
| `--_color---neutral--300` | `hsla(214, 23.44%, 73.88%, 1)` |
| `--_color---neutral--400` | `hsla(214, 15.15%, 64.64%, 1)` |
| `--_color---neutral--500` | `hsla(213, 14.71%, 53.10%, 1)` |
| `--_color---neutral--600` | `hsla(213, 21.12%, 41.28%, 1)` |
| `--_color---neutral--700` | `hsla(213, 21.12%, 33.03%, 1)` |
| `--_color---neutral--800` | `hsla(213, 21.13%, 24.77%, 1)` |
| `--_color---neutral--900` | `hsla(211.76, 21.52%, 16.46%, 1)` |
| `--_color---neutral--black` | `hsla(211.76, 21.52%, 7.41%, 1)` |

### 3b. Colors - New (rebrand palette)

| Variable | Value |
|---|---|
| `--_colors-new---primary--new-brand` | `hsla(27, 100%, 45.33%, 1)` (orange) |
| `--_colors-new---primary--secondary-brand` | `hsla(0, 68.22%, 30.44%, 1)` (deep red) |
| `--_colors-new---neutral--white` | `white` |
| `--_colors-new---neutral--100` | `#faf3ed` |
| `--_colors-new---neutral--200` | `hsla(27, 29.73%, 85.49%, 1)` |
| `--_colors-new---neutral--300` | `hsla(27, 28.67%, 71.96%, 1)` |
| `--_colors-new---neutral--400` | `hsla(27, 19.15%, 63.14%, 1)` |
| `--_colors-new---neutral--500` | `hsla(27, 13.19%, 53.92%, 1)` |
| `--_colors-new---neutral--600` | `hsla(27, 10.92%, 44.90%, 1)` |
| `--_colors-new---neutral--700` | `hsla(27, 10.87%, 36.08%, 1)` |
| `--_colors-new---neutral--800` | `hsla(27, 10.95%, 26.86%, 1)` |
| `--_colors-new---neutral--900` | `hsla(27, 10.87%, 18.04%, 1)` |
| `--_colors-new---neutral--black` | `hsla(27, 21.05%, 7.45%, 1)` |

---

## 4. Theme tokens (semantic, mode-aware)

**These are the tokens components should consume for color.** Each resolves to a different primitive depending on the active Theme mode.

The Theme collection has 4 states: **Default**, **Invert**, **Accent**, **Rebrand**.

### 4a. Surface & text

| Token | Default | Invert | Accent | Rebrand |
|---|---|---|---|---|
| `--colors--background` | `white` | `neutral-900` | `neutral-100` | `colors-new-neutral-100` |
| `--colors--secondary-background` | `neutral-100` | `neutral-800` | `white` | `colors-new-neutral-200` |
| `--colors--heading` | `neutral-900` | `white` | `neutral-800` | `colors-new-neutral-900` |
| `--colors--paragraph` | `neutral-700` | `neutral-100` | `neutral-600` | `colors-new-neutral-700` |
| `--colors--primary-accent` | `primary-brand` (blue) | `white` | `neutral-900` | `colors-new-new-brand` (orange) |
| `--colors--border` | `neutral-200` | `neutral-100` | `neutral-800` | `colors-new-new-brand` |

### 4b. Buttons

| Token | Default | Invert | Accent | Rebrand |
|---|---|---|---|---|
| `--button--primary-text` | `white` | `neutral-900` | `white` | `colors-new-white` |
| `--button--secondary-text` | `neutral-900` | `white` | `neutral-900` | `colors-new-neutral-900` |

### 4c. Logo colors

The logo uses a family of 7 tokens (background, inner shadow, drop shadow, light 1–3, dark 1–3) that are all `color-mix()` expressions derived from `--_color---primary--brand` (or `--_colors-new---primary--new-brand` in Rebrand mode). Components generally won't need these directly.

---

## 5. Typography

**Font families** (defined once, referenced by every type token):

| Variable | Value |
|---|---|
| `--_typography---fonts--primary-font` | `Inter` |
| `--_typography---fonts--secondary` | `PP Monument Extended` |

Every type scale uses the **primary font (Inter)** by default.

### Type scale

All font sizes are fluid (clamp between viewport 320px → 1440px). Line height, font weight, letter spacing, and bottom margin are static per step.

| Token group | Font size (rem min → max) | Weight | Line height | Letter spacing | Bottom margin |
|---|---|---|---|---|---|
| **H0** | 3.5 → 7.5 | 400 | 1 | -0.05em | 0.1em |
| **H1** | 2.8 → 5.5 | 500 | 1 | -0.02em | 0.2em |
| **H2** | 2.0 → 3.8 | 500 | 1.1 | -0.02em | 0.3em |
| **H3** | 1.5 → 2.3 | 500 | 1.2 | 0 | 0.3em |
| **H4** | 1.3 → 1.5 | 500 | 1.4 | 0 | 0.4em |
| **H5** | 1.1 → 1.2 | 500 | 1.4 | 0 | 0.5em |
| **H6** | 0.9 → 1.0 | 500 | 1.4 | 0 | 0.6em |
| **Paragraph XL** | 1.2 → 1.5 | 400 | 1.4 | 0 | 1em |
| **Paragraph LG** | 1.1 → 1.25 | 400 | 1.5 | 0 | 1em |
| **Paragraph (Body)** | 0.9 → 1.0 | 400 | 1.6 | 0 | 1em |
| **Paragraph SM** | 0.8 → 0.9 | 400 | 1.5 | 0 | 1em |
| **Eyebrow** | 0.7 → 0.8 | 500 | 1.2 | 0.05em | 1.5em |
| **Block Quote** | 1.5 → 2.0 | 400 | 1.2 | 0 | 1.2em |

### CSS variable names

Each row above expands to a set of tokens. Example for H1:

```css
--_typography---h1--font            /* → Inter */
--_typography---h1--font-size       /* → clamp(...) fluid size */
--_typography---h1--font-size-min-rem: 2.8;
--_typography---h1--font-size-max-rem: 5.5;
--_typography---h1--font-weight: 500;
--_typography---h1--line-height: 1;
--_typography---h1--letter-spacing: -0.02em;
--_typography---h1--bottom-margin: 0.2em;
```

Replace `h1` with `h0`, `h2`–`h6`, `paragraph-xl`, `paragraph-lg`, `paragraph-body`, `paragraph-sm`, `eyebrow`, or `block-quote` for the other steps.

---

## 6. Border radius

| Variable | Value |
|---|---|
| `--_border-radius---global--radius` | `1.5rem` |

This is the single source of radius. Cards and buttons inherit it; inputs use half (`calc(var(--_border-radius---global--radius) / 2)`).

---

## 7. Layout tokens

### 7a. Grid gaps

| Variable | Value |
|---|---|
| `--_layout---grid--gap-main` | `40px` |
| `--_layout---grid--gap-md` | `24px` |
| `--_layout---grid--gap-sm` | `8px` |
| `--_layout---grid--gap-button` | `0.75rem` |

### 7b. Spacing / padding scale

| Variable | Value |
|---|---|
| `--_layout---spacing--padding-xs` | `0.5em` |
| `--_layout---spacing--padding-sm` | `1em` |
| `--_layout---spacing--padding-md` | `2em` |
| `--_layout---spacing--padding-lg` | `3em` |

### 7c. Fluid viewport range

| Variable | Value |
|---|---|
| `--_layout---fluid--min` | `20` (unitless; rem → 320px) |
| `--_layout---fluid--max` | `90` (unitless; rem → 1440px) |

---

## 8. Component tokens

### 8a. Section

| Variable | Value |
|---|---|
| `--_components---section--padding` | fluid clamp, 3rem → 6rem |
| `--_components---section--padding-min-rem` | `3` |
| `--_components---section--padding-max-rem` | `6` |

### 8b. Container

| Variable | Value |
|---|---|
| `--_components---container--max-width` | `calc(var(--_layout---fluid--max) * 1rem)` = **90rem / 1440px** |

### 8c. Card

| Variable | Value |
|---|---|
| `--_components---card--border-radius` | → `--_border-radius---global--radius` (1.5rem) |
| `--_components---card--padding` | fluid clamp, 1rem → 1.5rem |
| `--_components---card--padding-min-rem` | `1` |
| `--_components---card--padding-max-rem` | `1.5` |

### 8d. Button

| Variable | Value |
|---|---|
| `--_components---button--font` | `Inter` |
| `--_components---button--font-weight` | `600` |
| `--_components---button--font-size` | `1rem` |
| `--_components---button--line-height` | `1.3em` |
| `--_components---button--letter-spacing` | `0em` |
| `--_components---button--border-radius` | → global radius (1.5rem) |
| `--_components---button--vertical-padding` | `0.7em` |
| `--_components---button--horizontal-padding` | `1em` |

Button text colors come from the Theme collection: `--button--primary-text` and `--button--secondary-text`.

### 8e. Input

| Variable | Value |
|---|---|
| `--_components---input--font` | `Inter` |
| `--_components---input--font-weight` | `400` |
| `--_components---input--font-size` | `1rem` |
| `--_components---input--line-height` | `1.5em` |
| `--_components---input--letter-spacing` | `0em` |
| `--_components---input--border-radius` | `calc(var(--_border-radius---global--radius) / 2)` = **0.75rem** |
| `--_components---input--bottom-margin` | `1rem` |

### 8f. Input label

| Variable | Value |
|---|---|
| `--_components---input-label--font` | `Inter` |
| `--_components---input-label--font-weight` | `500` |
| `--_components---input-label--font-size` | `0.9rem` |
| `--_components---input-label--line-height` | `1em` |
| `--_components---input-label--letter-spacing` | `0em` |

---

## 9. Rules for custom-coded components

1. **Always consume Theme tokens for color** (`--colors--background`, `--colors--heading`, `--colors--paragraph`, `--colors--primary-accent`, `--colors--border`, `--button--primary-text`, `--button--secondary-text`). They switch automatically with the active theme mode.
2. **Use typography tokens wholesale** — for a heading, set `font-family`, `font-size`, `font-weight`, `line-height`, `letter-spacing`, and `margin-bottom` from the matching H-step. Don't mix levels.
3. **Use the fluid sizing pattern** for any value that should scale with viewport. Don't add custom media queries for type or section padding.
4. **Reuse component tokens** for buttons, inputs, cards, sections, and containers instead of inventing new paddings, radii, or sizes.
5. **Border radius cascades from one global** — card and button use the full `--_border-radius---global--radius`; input uses half of it. Preserve this ratio for new components.
6. **Font weights in this system:** 400 (body / H0), 500 (H1–H6, eyebrow, input label), 600 (button). Stick to these three values.
7. **The Eyebrow has letter-spacing 0.05em and weight 500** — it's typically used uppercase above a heading.
8. **For raw brand color, use the primitive** (`--_color---primary--brand` blue, or `--_colors-new---primary--new-brand` orange for rebrand contexts). But in 99% of cases `--colors--primary-accent` is the right choice.

---

## 10. Quick-reference CSS starter block

```css
/* Theme (mode-aware) */
var(--colors--background)
var(--colors--secondary-background)
var(--colors--heading)
var(--colors--paragraph)
var(--colors--primary-accent)
var(--colors--border)
var(--button--primary-text)
var(--button--secondary-text)

/* Typography — swap {step} for h0|h1|h2|h3|h4|h5|h6|paragraph-xl|paragraph-lg|paragraph-body|paragraph-sm|eyebrow|block-quote */
var(--_typography---{step}--font)
var(--_typography---{step}--font-size)
var(--_typography---{step}--font-weight)
var(--_typography---{step}--line-height)
var(--_typography---{step}--letter-spacing)
var(--_typography---{step}--bottom-margin)

/* Layout */
var(--_layout---grid--gap-main)   /* 40px */
var(--_layout---grid--gap-md)     /* 24px */
var(--_layout---grid--gap-sm)     /* 8px  */
var(--_layout---grid--gap-button) /* 0.75rem */
var(--_layout---spacing--padding-xs) /* 0.5em */
var(--_layout---spacing--padding-sm) /* 1em   */
var(--_layout---spacing--padding-md) /* 2em   */
var(--_layout---spacing--padding-lg) /* 3em   */

/* Components */
var(--_components---section--padding)
var(--_components---container--max-width)
var(--_components---card--border-radius)
var(--_components---card--padding)
var(--_components---button--font-weight)     /* 600 */
var(--_components---button--font-size)       /* 1rem */
var(--_components---button--line-height)     /* 1.3em */
var(--_components---button--border-radius)
var(--_components---button--vertical-padding)   /* 0.7em */
var(--_components---button--horizontal-padding) /* 1em   */
var(--_components---input--border-radius)    /* 0.75rem */
var(--_components---input-label--font-weight) /* 500 */

/* Global */
var(--_border-radius---global--radius) /* 1.5rem */
```
