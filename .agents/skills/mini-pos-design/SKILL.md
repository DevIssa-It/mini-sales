---
name: mini-pos-design
description: "Design system rules for Mini POS project. Applies when working on frontend code in mini-pos project — enforces HubSpot-inspired design tokens, component patterns, and anti-slop frontend quality standards."
---

# Mini POS Design System Skill

When working on the Mini POS frontend, follow these rules strictly.

## Design Read (Fixed)

> "Internal B2B POS tool for business operators — professional-premium, HubSpot-inspired (dark teal #124548, warm off-white surfaces #fcfcfa). DESIGN_VARIANCE: 6 | MOTION_INTENSITY: 3 | VISUAL_DENSITY: 6"

This is NOT a marketing site. It is a daily-use operational tool. Design for clarity and data density, not visual drama.

## Technology Constraints

- Framework: Vite + React 19 + TypeScript
- Styling: Tailwind CSS v4 + custom CSS variables (NO Tailwind v3 config)
- Icons: `@phosphor-icons/react` ONLY (no lucide-react, no hand-rolled SVGs)
- State: Zustand for cart, React Query for server state
- Toast: react-hot-toast

## Color Usage Rules

1. ALL colors via CSS variables: `var(--color-primary)`, `var(--color-accent)`, etc.
2. NO hardcoded hex in JSX style props
3. NO arbitrary Tailwind color values
4. See `design.md` for full token list

## Component Rules

### Buttons
- Use `.btn` + variant class (`.btn-primary`, `.btn-accent`, `.btn-ghost`, `.btn-danger`, `.btn-outline`)
- ONE `.btn-accent` per page maximum (checkout CTA only)
- All icon-only buttons need `aria-label`

### Forms
- Label above input, NEVER placeholder-as-label
- Error text below input with `color: var(--color-danger)`, font-size 12px
- Required fields: `*` in danger color after label

### Loading States
- Use `<Skeleton>` components, NOT spinners
- `<TableSkeleton>` for tables, `<CardSkeleton>` for grids

### Empty States
- Always use `<EmptyState>` component
- Include an icon (Phosphor, size 28), title, optional description and action

## Architecture Rules

- Pages in `src/pages/` — NO business logic in pages, delegate to hooks/store
- Components in `src/components/` — keep focused and reusable
- ALL API calls through `src/lib/api.ts` — NO direct fetch/axios in components
- Formatting: use `formatCurrency()` and `formatDate()` from `src/lib/utils.ts`
- Types: import from `src/types/index.ts`

## Anti-Pattern Prevention

- NO `h-screen` — use `min-h-[100dvh]`
- NO spinner — use Skeleton components
- NO placeholder-as-label
- NO inline API calls — use `src/lib/api.ts`
- NO hardcoded colors
- NO `useState` for server data — use React Query
- NO mixed icon libraries

## References

- Full design tokens: `/design.md`
- Project rules: `/AGENTS.md`
