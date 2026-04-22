# Derek's Code Component Library

A library of custom React components for Webflow, built with Claude and published via the Webflow CLI. Components appear in the **SE Enterprise Workspace** under Libraries → Shared Libraries in the Designer.

For a full overview of how Webflow Code Components work, see the [official quick-start guide](https://developers.webflow.com/code-components/introduction/quick-start).

---

## Components

| Name | Group | Description |
|---|---|---|
| Badge | Info | Text badge with Light and Dark variants |

---

## Getting started

### 1. Prerequisites

- Node.js (v18+)
- A Webflow account with access to the workspace
- [Claude Code](https://claude.ai/code) installed (`npm install -g @anthropic-ai/claude-code`)

### 2. Clone the repo

```bash
git clone https://github.com/derek-fang/code-components.git
cd code-components
npm install
```

### 3. Get your Webflow API token

1. Go to your [Webflow Dashboard](https://webflow.com/dashboard)
2. Click your avatar → **Account Settings → Integrations**
3. Under **API Access**, generate a new token with **Code Components** permissions

### 4. Connect to your Webflow project

Create a `.env` file in the root of the repo:

```
WEBFLOW_API_TOKEN=your_token_here
```

> `.env` is gitignored — never commit it.

Then link the library to your workspace by running the share command once:

```bash
printf 'y\n' | npx webflow library share
```

This creates (or updates) a shared library in your workspace and walks you through any first-time auth prompts. On success you'll see:

```
✔ Sharing library
Code library shared successfully: https://webflow.com/dashboard/workspace/...
```

### 5. Add the library to your Webflow site

1. Open your site in the **Webflow Designer**
2. Go to **Libraries → Shared Libraries**
3. Find the library and click **Add to site**

Components will now appear in the Designer's insert panel.

---

## Building new components with Claude

This repo is set up to work with Claude Code. Once you've cloned and connected your environment, you can prompt Claude to build new components and publish them — no manual coding required.

### Start a Claude session

```bash
claude
```

### Example prompts

- *"Build me a count-up stat component that animates a number when it scrolls into view"*
- *"Create an accordion FAQ component with animated expand/collapse"*
- *"Add a testimonial card with avatar, quote, and name — use the design system tokens"*
- *"Push the latest changes to Webflow"*

Claude will create the `ComponentName.tsx` and `ComponentName.webflow.tsx` files and can publish directly to Webflow when asked. The `CLAUDE.md` file in this repo gives Claude full context on the project structure and the Tripfold design system tokens.

### Publishing manually

To publish without Claude:

```bash
printf 'y\n' | npx webflow library share
```

---

## Project structure

```
src/
  Badge.tsx               # React implementation (inline styles only)
  Badge.webflow.tsx       # Webflow declaration (props panel, name, group)
webflow.json              # Library manifest — picks up all *.webflow.tsx files
CLAUDE.md                 # Design system reference and project guide for Claude
.env                      # Your API token (gitignored — create this locally)
```

Every new component = two files. See `src/Badge.tsx` and `src/Badge.webflow.tsx` as a reference.

---

## Notes

- **Inline styles only.** Components ship as isolated bundles — no external CSS, no Tailwind. Use `var(--token-name)` CSS variables; they resolve from the host Webflow page at render time.
- **`npx webflow library bundle` is currently broken.** Use `share` directly — it compiles and uploads in one step.
- **`npm start`** runs the default CRA dev server against `src/App.js`, unrelated to Webflow. To preview a component locally, render it in `App.js` temporarily.
