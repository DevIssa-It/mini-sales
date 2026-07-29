# AGENTS.md — Mandatory Rules & Architecture Conventions

This file defines mandatory instructions for all AI coding agents working in this project.

## ⚠️ MANDATORY FIRST STEP FOR ALL AI AGENTS
Before executing any code changes, creating new files, or refactoring:
1. **Read this `AGENTS.md` file**.
2. **Read `design.md`** for design system tokens.
3. **Read `.agents/skills/mini-pos-design/SKILL.md`** for frontend anti-slop guidelines.

---

## 1. STRICT DRY (DON'T REPEAT YOURSELF) RULES
- **NEVER duplicate UI components or layout wrappers**.
- **ALWAYS REUSE Existing Modular Components**:
  - Layout Wrapper: `<PageContainer>`
  - Quantity Selector: `<QuantitySelector>`
  - Action Confirmation Modal: `<ConfirmDialog>`
  - Add to Cart Modal: `<AddToCartModal>`
  - Form Input Field Wrapper: `<FormField>`
  - Empty State View: `<EmptyState>`
  - Skeleton Loading View: `<TableSkeleton>`, `<Skeleton>`
  - Struk / Transaction Receipt Breakdown: `<TransactionReceipt>`
- **ALWAYS REUSE Centralized Utilities**:
  - Currency Formatting: `formatCurrency()` from `src/lib/utils.ts`
  - Date Formatting: `formatDate()` from `src/lib/utils.ts`
  - API Client: Centralized Axios functions in `src/lib/api.ts`
  - Types: Import from `src/types/index.ts`

---

## 2. DESIGN SYSTEM & VISUAL RULES
- **No Hardcoded Hex Colors**: Use CSS Variables (`var(--color-primary)`, `var(--color-accent)`, `var(--color-surface)`, etc.).
- **Typography Discipline**:
  - Headers: `var(--font-display)` / `var(--font-sans)`
  - Currency & Quantities: ALWAYS `var(--font-mono)`
- **No Generic Spinners**: Use layout-matching Skeleton components.
- **Form Inputs**: Every input MUST have an explicit `<label>` above it and error text below it via `<FormField>`. No placeholder-as-label.

---

## 3. BACKEND & INTEGRITY RULES
- **Server-Side Price Calculation**: NEVER trust price sent from frontend. Checkout MUST fetch price from database.
- **Atomic Transactions**: Use `prisma.$transaction()` for stock deduction & transaction record creation to prevent negative stock & race conditions.
- **Price Snapshot Pattern**: Store `priceAtTime` and `productName` in `TransactionItem` so historical receipts remain unchanged when products are edited.

---

## 4. PRE-FLIGHT VERIFICATION CHECKLIST
Before marking any turn or task as completed:
1. Run `npx tsc --noEmit` on the frontend (must be 0 errors).
2. Run `npm test` on the backend (all unit tests must PASS).
3. Ensure no single frontend component file exceeds ~120 lines.
