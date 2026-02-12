# AGENTS.md

Operational guide for coding agents working in `lettr-web`.

## Project Snapshot

- Stack: SvelteKit 2 + Svelte 5 (runes) + TypeScript + Vite 7.
- Styling: Tailwind CSS v4 via `@tailwindcss/postcss` and `src/styles/app.css` theme tokens.
- Package manager: `pnpm` (lockfile is `pnpm-lock.yaml`).
- Deployment adapter: Vercel adapter (`@sveltejs/adapter-vercel`) in `svelte.config.js`.
- Rendering flags: `src/routes/+layout.ts` sets `prerender = true` and `trailingSlash = 'always'`.

## Source Layout

- `src/routes/+layout.svelte`: global page shell, SEO/meta tags, navbar, canvas, spline footer wrapper.
- `src/routes/+page.svelte`: homepage composition of section components.
- `src/lib/components/*.svelte`: reusable UI sections and widgets.
- `src/lib/utils/shiki.ts`: syntax highlighting theme + singleton highlighter + sample code tabs.
- `src/lib/utils/spline.ts`: spline loader + visibility gating helpers.
- `src/styles/app.css`: Tailwind import, custom theme tokens, base rules, and utility classes.

## Setup & Core Commands

- Install dependencies: `pnpm install`
- Start dev server: `pnpm dev`
- Start dev server and expose host: `pnpm dev -- --host`
- Build production app: `pnpm build`
- Preview production build: `pnpm preview`
- Sync SvelteKit types/config: `pnpm prepare`

## Lint / Typecheck / Test Commands

- Primary static check (acts as lint+type gate here): `pnpm check`
- Continuous checking during edits: `pnpm check:watch`
- There is no dedicated linter script (`lint`) configured right now.
- Unit tests: `pnpm test:unit`
- Unit tests in watch mode: `pnpm test:unit:watch`
- Current test scope is light and focused; add tests near related utilities/components.

## Single-Test Guidance (Important)

- Run one test file with: `pnpm vitest src/path/to/file.test.ts`
- Run one test by name with: `pnpm vitest -t "test name"`
- CI baseline for risky changes: `pnpm check` + `pnpm test:unit` + `pnpm build`.

## Agent Workflow Expectations

- Before editing, inspect nearby components/utilities for local conventions.
- Prefer minimal, surgical changes; avoid broad refactors unless requested.
- Keep public behavior and design consistent with existing sections.
- Reuse existing components/tokens before introducing new patterns.
- After changes, run at least: `pnpm check`.
- For risky or structural changes, run both: `pnpm check` and `pnpm build`.

## TypeScript Guidelines

- Keep `strict`-mode compatibility (`tsconfig.json` has `"strict": true`).
- Prefer explicit interfaces for component props (`interface Props { ... }`).
- Type callback props and event handlers precisely (avoid `any`).
- Use narrow unions for variants/states (example: `'primary' | 'secondary'`).
- Prefer `unknown` + narrowing over `any` for generic passthrough data.
- Keep shared types near their usage unless reused across modules.
- Preserve `type`-only imports where appropriate.

## Svelte 5 Component Conventions

- Use runes-style APIs consistently (`$props`, `$state`, `$derived`, `$bindable`).
- Destructure props in one place near top of `<script lang="ts">`.
- Keep component state local; lift only when reuse demands it.
- Guard DOM-dependent code in `onMount`.
- Clean up global listeners in `onMount` return callbacks.
- Prefer early returns for no-op conditions.
- Keep markup readable; avoid deeply nested conditional branches when possible.

## Imports & Module Boundaries

- Order imports by role: framework/runtime, third-party, then local modules.
- Use `$lib/...` aliases for internal imports instead of long relative paths.
- Keep one import per line; avoid wildcard imports.
- Remove unused imports quickly; do not leave dead symbols.
- Prefer named imports unless a module is clearly default-export oriented.

## Naming Conventions

- Components: PascalCase filenames and symbols (`Navbar.svelte`, `CodeSnippet.svelte`).
- Variables/functions: camelCase (`toggleMore`, `copyCommands`, `highlighter`).
- Constants: camelCase for local constants; UPPER_SNAKE only for true global constants.
- Prop interfaces: `Props` inside each component unless sharing demands extraction.
- Booleans: use `is/has/can/should` prefixes when semantically helpful (`isMoreActive`).

## Formatting & Style

- Follow existing formatting (tabs, semicolons, single quotes in TS/JS).
- Keep lines compact but readable; wrap long class lists thoughtfully.
- Prefer existing utility-first styling patterns over ad-hoc CSS.
- Use theme tokens from `src/styles/app.css` (`--color-*`, `--font-*`, `--text-*`).
- Only add comments when intent is non-obvious; avoid commentary noise.

## Tailwind / CSS Rules

- Favor utility classes in markup for component-level styling.
- Add global/theme changes in `src/styles/app.css`, not scattered files.
- Reuse existing custom variant `narrow` for <=500px behavior where appropriate.
- Maintain the established visual language (colors, spacing, shadows, typography).
- Avoid introducing conflicting design systems or token sets.

## Accessibility & UX

- Preserve semantic structure (`nav`, `main`, headings, button vs anchor correctness).
- Ensure interactive elements have accessible labels (`aria-label` where needed).
- Keep keyboard and focus behavior intact when adding interactions.
- For external links, keep `target="_blank"` paired with `rel="noopener noreferrer"`.
- Do not regress contrast/readability against the current palette.

## Error Handling & Async Patterns

- Wrap async UI flows with safe defaults and predictable state transitions.
- Guard optional DOM refs before animation/DOM operations.
- Fail soft in UI helpers when practical (do not crash render for non-critical effects).
- Surface meaningful errors when adding network/data logic in future routes.
- Prefer explicit control flow over silent catch-all suppression.

## Performance Guidelines

- Avoid re-creating expensive objects repeatedly (see singleton highlighter pattern).
- Keep animation work scoped and kill/reuse GSAP tweens where needed.
- Avoid unnecessary reactive churn; derive values with `$derived` when suitable.
- Defer heavy client-only behavior to `onMount`.

## Validation Checklist for Agents

- Run `pnpm check` after edits.
- Run `pnpm build` for major changes.
- Confirm no accidental file churn in unrelated areas.
- Ensure imports are clean and types are strict-safe.
- Verify changed UI blocks still render correctly at narrow and default widths.

## Git & PR Hygiene

- Keep commits focused and scoped to a single concern.
- Do not commit lockfile or dependency changes unless required by task.
- Document any new commands/scripts in this file when tooling changes.
- If you introduce a test runner/linter, update command sections immediately.

## Cursor / Copilot Rules Status

- Checked for `.cursorrules`: not present.
- Checked for `.cursor/rules/`: not present.
- Checked for `.github/copilot-instructions.md`: not present.
- If any of these files are added later, treat their instructions as highest-priority project rules and merge them into this guide.

## Quick Decision Defaults

- Need validation? Run `pnpm check` first.
- Need production confidence? Run `pnpm build` next.
- Need a single test? Use `pnpm vitest src/path/to/file.test.ts`.
- Need styling direction? Reuse existing Tailwind utilities and theme tokens.
- Need new architecture? Keep it incremental and aligned with current SvelteKit structure.
