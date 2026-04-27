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

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, but it invokes Vite through `vp dev` and `vp build`.

## Vite+ Workflow

`vp` is a global binary that handles the full development lifecycle. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

### Start

- create - Create a new project from a template
- migrate - Migrate an existing project to Vite+
- config - Configure hooks and agent integration
- staged - Run linters on staged files
- install (`i`) - Install dependencies
- env - Manage Node.js versions

### Develop

- dev - Run the development server
- check - Run format, lint, and TypeScript type checks
- lint - Lint code
- fmt - Format code
- test - Run tests

### Execute

- run - Run monorepo tasks
- exec - Execute a command from local `node_modules/.bin`
- dlx - Execute a package binary without installing it as a dependency
- cache - Manage the task cache

### Build

- build - Build for production
- pack - Build libraries
- preview - Preview production build

### Manage Dependencies

Vite+ automatically detects and wraps the underlying package manager such as pnpm, npm, or Yarn through the `packageManager` field in `package.json` or package manager-specific lockfiles.

- add - Add packages to dependencies
- remove (`rm`, `un`, `uninstall`) - Remove packages from dependencies
- update (`up`) - Update packages to latest versions
- dedupe - Deduplicate dependencies
- outdated - Check for outdated packages
- list (`ls`) - List installed packages
- why (`explain`) - Show why a package is installed
- info (`view`, `show`) - View package information from the registry
- link (`ln`) / unlink - Manage local package links
- pm - Forward a command to the package manager

### Maintain

- upgrade - Update `vp` itself to the latest version

These commands map to their corresponding tools. For example, `vp dev --port 3000` runs Vite's dev server and works the same as Vite. `vp test` runs JavaScript tests through the bundled Vitest. The version of all tools can be checked using `vp --version`. This is useful when researching documentation, features, and bugs.

## Common Pitfalls

- **Using the package manager directly:** Do not use pnpm, npm, or Yarn directly. Vite+ can handle all package manager operations.
- **Always use Vite commands to run tools:** Don't attempt to run `vp vitest` or `vp oxlint`. They do not exist. Use `vp test` and `vp lint` instead.
- **Running scripts:** Vite+ built-in commands (`vp dev`, `vp build`, `vp test`, etc.) always run the Vite+ built-in tool, not any `package.json` script of the same name. To run a custom script that shares a name with a built-in command, use `vp run <script>`. For example, if you have a custom `dev` script that runs multiple services concurrently, run it with `vp run dev`, not `vp dev` (which always starts Vite's dev server).
- **Do not install Vitest, Oxlint, Oxfmt, or tsdown directly:** Vite+ wraps these tools. They must not be installed directly. You cannot upgrade these tools by installing their latest versions. Always use Vite+ commands.
- **Use Vite+ wrappers for one-off binaries:** Use `vp dlx` instead of package-manager-specific `dlx`/`npx` commands.
- **Import JavaScript modules from `vite-plus`:** Instead of importing from `vite` or `vitest`, all modules should be imported from the project's `vite-plus` dependency. For example, `import { defineConfig } from 'vite-plus';` or `import { expect, test, vi } from 'vite-plus/test';`. You must not install `vitest` to import test utilities.
- **Type-Aware Linting:** There is no need to install `oxlint-tsgolint`, `vp lint --type-aware` works out of the box.

## CI Integration

For GitHub Actions, consider using [`voidzero-dev/setup-vp`](https://github.com/voidzero-dev/setup-vp) to replace separate `actions/setup-node`, package-manager setup, cache, and install steps with a single action.

```yaml
- uses: voidzero-dev/setup-vp@v1
  with:
    cache: true
- run: vp check
- run: vp test
```

## Review Checklist for Agents

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to validate changes.
<!--VITE PLUS END-->
