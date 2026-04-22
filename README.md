# Derek's Code Component Library

A library of custom React components for Webflow, published via the Webflow CLI. Components are available in the **SE Enterprise Workspace** under Libraries → Shared Libraries in the Designer.

## Components

| Name | Group | Description |
|---|---|---|
| Badge | Info | Text badge with Light and Dark variants |

## Setup

**Prerequisites:** Node.js, a Webflow account with API access.

1. Clone the repo:
   ```bash
   git clone https://github.com/derek-fang/code-components.git
   cd code-components
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root with your Webflow API token:
   ```
   WEBFLOW_API_TOKEN=your_token_here
   ```
   Get your token from the [Webflow dashboard](https://webflow.com/dashboard) under Account → Integrations → API Access.

## Adding a new component

Every component is two files:

- `src/ComponentName.tsx` — the React implementation (inline styles only, no external CSS)
- `src/ComponentName.webflow.tsx` — the Webflow declaration that registers it in the Designer

See `src/Badge.tsx` and `src/Badge.webflow.tsx` as a reference, and `CLAUDE.md` for the full design system token reference.

## Publishing to Webflow

```bash
printf 'y\n' | npx webflow library share
```

This compiles and uploads all components to the shared library. The diff (Added / Updated / Removed) is shown before confirming.

On success you'll see:
```
✔ Sharing library
Code library shared successfully: https://webflow.com/dashboard/workspace/...
```

The library is then available in any site in the workspace.

## Notes

- Use `var(--token-name)` CSS variables in inline styles — they resolve from the host Webflow page at render time. See `CLAUDE.md` for the full token reference.
- `npm start` runs the CRA dev server against `src/App.js`, which is unrelated to Webflow publishing. To preview a component locally, render it in `App.js` temporarily.
- `npx webflow library bundle` is currently broken — use `share` directly.
