# Mini POS — Design System Reference

Referensi design tokens dan panduan komponen untuk Mini POS.
Terinspirasi dari design system HubSpot (professional B2B, dark teal primary).

---

## Design Read

**"Internal B2B POS tool untuk operator bisnis — professional-premium, HubSpot-inspired
(dark teal #124548, warm surfaces #fcfcfa), Tailwind CSS v4 + custom CSS variables.
DESIGN_VARIANCE: 6 | MOTION_INTENSITY: 3 | VISUAL_DENSITY: 6"**

---

## Color Tokens

| Token CSS Variable | Value | Usage |
|---|---|---|
| `--color-primary` | `#124548` | Header, primary CTA, active states |
| `--color-primary-hover` | `#0d3336` | Hover state untuk primary |
| `--color-primary-light` | `#e8f0f1` | Hover bg untuk outline buttons |
| `--color-accent` | `#ff4800` | Checkout CTA, key action |
| `--color-accent-hover` | `#e03f00` | Hover state untuk accent |
| `--color-background` | `#ffffff` | Page background |
| `--color-surface` | `#fcfcfa` | Card, panel, table header bg |
| `--color-surface-2` | `#f5f3ee` | Hover rows, secondary containers |
| `--color-border` | `#e2ddd6` | Default border, dividers |
| `--color-border-strong` | `#c5bfb6` | Focus rings, emphasized borders |
| `--color-text` | `#1f1f1f` | Primary text |
| `--color-text-muted` | `#6b6762` | Secondary text, labels |
| `--color-text-light` | `#9b968f` | Placeholders, captions |
| `--color-success` | `#16a34a` | Success badges, notifications |
| `--color-success-light` | `#dcfce7` | Success badge background |
| `--color-warning` | `#d97706` | Low stock warning |
| `--color-warning-light` | `#fef3c7` | Warning badge background |
| `--color-danger` | `#dc2626` | Error, out of stock, delete |
| `--color-danger-light` | `#fee2e2` | Error badge background |

---

## Typography

| Variable | Font | Usage |
|---|---|---|
| `--font-display` | DM Serif Display | Section titles (digunakan sparingly) |
| `--font-sans` | Inter | Body, UI labels, semua teks utama |
| `--font-mono` | JetBrains Mono | Harga (currency), transaction IDs, kode |

### Rules
- Harga selalu render dengan `font-family: var(--font-mono)` untuk readability
- Transaction IDs render dengan `<code>` + `var(--font-mono)`
- Heading halaman: `fontSize: 24px, fontWeight: 700, letterSpacing: -0.02em`
- Section label (eyebrow): `font-size: 11px, font-weight: 600, letter-spacing: 0.08em, text-transform: uppercase` — maksimal 1 per 3 section

---

## Radius Scale

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | `6px` | Kecil: badge, tag |
| `--radius-md` | `10px` | Standar: button, input, card kecil |
| `--radius-lg` | `16px` | Card utama, modal |
| `--radius-xl` | `24px` | Panel besar |
| `--radius-full` | `9999px` | Badge pill, avatar |

**Aturan konsistensi**: Satu halaman menggunakan satu skala radius yang konsisten. Button dan input menggunakan `--radius-md`. Card menggunakan `--radius-lg`. Badge menggunakan `--radius-full`.

---

## Button System

```css
/* Base classes (selalu dipakai bersama .btn) */
.btn           /* base: display, padding, transition */
.btn-sm        /* padding kecil */
.btn-lg        /* padding besar */
.btn-icon      /* square, padding seragam */

/* Variants */
.btn-primary   /* bg: primary, text: white — untuk aksi utama */
.btn-accent    /* bg: accent (orange) — untuk checkout/CTA critical */
.btn-outline   /* border: primary, text: primary — secondary action */
.btn-ghost     /* border: subtle, text: muted — utility action */
.btn-danger    /* border: danger, text: danger — delete/destructive */
```

**Rules**:
- Satu halaman maksimal 1 `.btn-accent` (checkout/primary CTA)
- Delete action: gunakan `.btn-danger` bukan `.btn-primary`
- Icon-only buttons: gunakan `.btn-icon` + `aria-label`

---

## Badge System

```css
.badge           /* base: inline-flex, rounded-full, kecil */
.badge-success   /* hijau — status aktif, transaksi sukses */
.badge-danger    /* merah — nonaktif, stok habis */
.badge-warning   /* kuning — stok rendah */
.badge-neutral   /* abu — info netral, jumlah item */
```

---

## Input System

```css
.input           /* base input styling */
.input-error     /* border merah, focus ring merah */
```

**Rules**:
- Label SELALU di atas input (bukan placeholder-as-label)
- Helper/error text di bawah input
- `gap: 6px` antara label dan input
- Required field: `<span style="color: var(--color-danger)">*</span>` setelah label

---

## Table System

```css
.table-base     /* full-width, collapsed borders */
/* th: uppercase, small, muted, surface bg */
/* td: padding 12px 14px, border-bottom */
/* tr:hover: surface background */
```

---

## Loading States

- Gunakan `<Skeleton>` dengan `style` prop untuk ukuran yang sesuai layout akhir
- `<TableSkeleton rows={n}>` untuk tabel
- `<CardSkeleton count={n}>` untuk card grid
- **Jangan** gunakan spinner generik

---

## Empty States

Gunakan komponen `<EmptyState>` dengan:
- `icon`: Phosphor icon (ukuran 28)
- `title`: Kalimat singkat deskriptif
- `description`: (opsional) penjelasan atau panduan
- `action`: (opsional) button untuk trigger aksi

---

## Layout Rules

- **Max width**: `maxWidth: 1200px, margin: '0 auto', padding: '0 24px'`
- **Page top padding**: `padding: '32px 24px'`
- **Navbar height**: 64px, sticky, `z-index: 50`
- **Sticky sidebar**: `position: sticky, top: 80px` (di bawah navbar)
- **Grid system**: CSS Grid dengan `gap: 24px` — tidak ada flex percentage math
- Mobile: semua grid collapse ke 1 kolom di `< 768px`

---

## Motion Rules (MOTION_INTENSITY: 3 — minimal)

- Hover states: `transition: background-color 150ms ease`
- Button active: `transform: scale(0.98)` via CSS `:active`
- **Tidak ada** infinite animations di dalam tabel/list
- **Tidak ada** page transitions
- Skeleton: `animation: skeleton-pulse 1.5s ease-in-out infinite` (sudah di CSS global)

---

## Page-by-Page Inventory

### ProductsPage (`/`)
- **Layout**: Single column, full-width table
- **Header**: Title + jumlah produk + button "Tambah Produk" (`.btn-primary`)
- **Filter bar**: search input + filter pills (semua/aktif/nonaktif)
- **Table**: Nama | Harga (mono) | Stok (colored) | Status (badge) | Aksi
- **Modal**: `<ProductForm>` di atas page

### CartPage (`/cart`)
- **Layout**: 2-column grid (cart items | order summary sticky)
- **Cart items**: quantity control (Minus/input/Plus) + subtotal + hapus
- **Summary**: sticky card dengan total + `.btn-accent` checkout
- **Empty**: `<EmptyState>` dengan link ke Products
- **Success**: receipt screen setelah checkout berhasil

### TransactionsPage (`/transactions`)
- **Layout**: Single column, full-width table
- **Table**: ID (mono, truncated) | Waktu | Jumlah item (badge) | Total (mono, primary) | Link detail

### TransactionDetailPage (`/transactions/:id`)
- **Layout**: Max-width 640px, centered
- **Header card**: primary background dengan ID + waktu
- **Items list**: productName + priceAtTime × qty + subtotal
- **Footer**: total dengan emphasis
