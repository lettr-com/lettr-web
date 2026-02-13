# lettr-web

Landing site for Lettr, built with SvelteKit 2, Svelte 5, TypeScript, and Tailwind CSS v4.

## Stack

- SvelteKit + Svelte 5 (runes)
- TypeScript (strict mode)
- Tailwind CSS v4
- GSAP animations
- Three.js canvas effects
- Vitest unit tests

## Setup

```sh
pnpm install
```

## Development

```sh
pnpm dev

# expose dev server on local network
pnpm dev -- --host
```

## Quality checks

```sh
# static checks (Svelte + TypeScript)
pnpm check

# unit tests
pnpm test:unit

# watch mode for unit tests
pnpm test:unit:watch
```

Run a single test file:

```sh
pnpm vitest src/path/to/file.test.ts
```

Run one test by name:

```sh
pnpm vitest -t "test name"
```

## Build and preview

```sh
pnpm build
pnpm preview
```

## Notable structure

- `src/routes/+layout.svelte`: global layout shell and page metadata
- `src/lib/components/SplineFooter.svelte`: lazy-loaded Spline footer scene wrapper
- `src/lib/utils/spline.ts`: Spline visibility gating and script loader utilities
- `src/lib/components/BorderLinesCanvas.svelte`: animated Three.js border lines
- `src/lib/utils/shiki.ts`: syntax highlighting setup and singleton highlighter

## Booking analytics funnel (PostHog)

The `/demo` flow is instrumented with PostHog events in `src/routes/demo/+page.svelte`.

```mermaid
flowchart TD
    A[book_page_viewed] --> B[book_volume_selected]
    B --> C[book_routing_decided]

    C -->|selfServe| D[book_routed_self_serve]
    D --> E[book_self_serve_create_account_clicked]
    D --> F[book_self_serve_docs_clicked]

    C -->|demo or priorityDemo| G[book_config_loaded]
    G --> H[book_slots_loaded]
    H --> I[book_day_selected]
    I --> J[book_slot_selected]
    J --> K[book_confirm_started]
    K --> L[book_reservation_confirmed]

    C --> X1[book_routing_validation_failed]
    G --> X2[book_config_load_failed]
    H --> X3[book_slots_load_failed]
    J --> X4[book_confirm_validation_failed]
    K --> X5[book_reservation_failed]
```

Shared event properties are attached to each event:

- `funnel_name`: `booking_funnel`
- `funnel_version`: `1`
- `page`: `/demo`
- `timezone`: client timezone
