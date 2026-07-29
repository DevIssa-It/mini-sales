# TECHNICAL DOCUMENTATION — MINI POINT OF SALE (POS)

**Nama Proyek**: Mini Point of Sale (POS) Application  
**Program**: Xolvon Project Incubator Program — Web Developer Recruitment Test  
**Tanggal**: 29 Juli 2026  
**Repository**: [github.com/DevIssa-It/mini-sales](https://github.com/DevIssa-It/mini-sales.git)  

---

## 1. Ringkasan Eksekutif

Aplikasi web **Mini Point of Sale (POS)** ini dikembangkan secara full-stack dari awal (*from scratch*) tanpa starter template untuk mengelola produk, keranjang belanja, checkout transaksi, dan riwayat penjualan kasir. Seluruh arsitektur dibangun dengan standar produksi B2B modern yang mengutamakan **keamanan transaksi server-side**, **pengurangan stok atomik**, **antarmuka kasir yang responsif (HubSpot Design System)**, serta **100% kepatuhan pada prinsip DRY (Don't Repeat Yourself)**.

---

## 2. Arsitektur Sistem & Alur Data

Aplikasi ini menggunakan arsitektur Decoupled Client-Server (REST API):

```
┌────────────────────────────────────────────────────────┐
│                   Vite + React 19 SPA                  │
│  (Zustand Cart Store + React Query + Tailwind CSS v4)  │
└───────────────────────────┬────────────────────────────┘
                            │ REST API (JSON via Axios)
┌───────────────────────────▼────────────────────────────┐
│                  NestJS Standalone API                 │
│   (Validation Pipes + Business Logic + Prisma ORM)     │
└───────────────────────────┬────────────────────────────┘
                            │ Database Queries / Transactions
┌───────────────────────────▼────────────────────────────┐
│                  PostgreSQL Database                   │
│      (Product, Transaction, TransactionItem Tables)    │
└────────────────────────────────────────────────────────┘
```

### Relasi Database (Prisma Schema):

* **`Product`**: `id` (UUID), `name` (String), `price` (Decimal), `stock` (Int), `isActive` (Boolean), `category` (String), `imageUrl` (String opsional), `createdAt`, `updatedAt`.
* **`Transaction`**: `id` (UUID), `total` (Decimal), `createdAt`.
* **`TransactionItem`**: `id` (UUID), `transactionId` (FK), `productId` (FK), `productName` (Snapshot), `priceAtTime` (Snapshot Decimal), `quantity` (Int), `subtotal` (Decimal).

---

## 3. Teknologi yang Digunakan & Rationale

| Layer | Teknologi | Alasan Pemilihan |
|---|---|---|
| **Backend** | NestJS + TypeScript | Arsitektur modular standar industri dengan *Dependency Injection* bawaan. Memisahkan controller, service, dan DTO secara terstruktur. |
| **Database ORM** | Prisma ORM 7 + PostgreSQL | Type-safety penuh dari skema database, dukungan tipe data `Decimal` untuk presisi uang, serta transaksi atomik (`$transaction`). |
| **Frontend** | Vite + React 19 + TypeScript | SPA ultra-cepat dengan waktu *cold-build* instant, cocok untuk alat operasional internal kasir yang butuh navigasi tanpa reload. |
| **State Management** | Zustand (Cart) + React Query (Server) | Zustand mengelola state keranjang lokal dengan persistence `localStorage`. React Query mengelola caching & auto-fetching data produk dari server. |
| **Styling & Print** | Tailwind CSS v4 + Design System Tokens + CSS `@media print` | Kustomisasi variabel CSS terinspirasi dari HubSpot Design System (Professional B2B Teal Palette) serta dukungan cetak struk thermal fisik. |

---

## 4. Fitur Selesai vs Belum Selesai

### ✅ Fitur Selesai (100% Core Requirements & High-Value Enhancements):

1. **Manajemen & Kategori Produk**:
   * Menampilkan daftar produk dengan foto thumbnail Unsplash & avatar inisial.
   * Pengelompokan Kategori (`Minuman`, `Makanan`, `Snack`, `Lainnya`) dengan *Pill Filter Categories*.
   * Tambah & edit produk dengan dropdown kategori dan URL gambar.
   * Mengaktifkan/menonaktifkan produk secara instan.
2. **Keranjang Belanja & Modal Kuantitas Custom**:
   * Modal dialog pop-up `AddToCartModal` saat memilih item untuk menentukan kuantitas custom sekaligus (misal langsung beli 5 item).
   * Pengatur kuantitas di keranjang belanja (`QuantitySelector`).
   * Validasi stok real-time (mencegah kuantitas melebihi stok yang ada).
   * Modal dialog konfirmasi checkout & kosongkan keranjang (`ConfirmDialog`).
3. **Checkout & Keamanan Server-side**:
   * Kalkulasi harga & total transaksi murni di server-side (mencegah penipuan harga dari frontend).
   * Transaksi atomik database (`prisma.$transaction`) untuk pengurangan stok aman dari *race condition*.
   * Validasi stok `>= 0` dan produk harus status aktif.
4. **Riwayat, Struk Thermal & Dashboard Analitik**:
   * Dashboard Analitik Penjualan Real-Time (**Total Omset Pendapatan**, **Total Transaksi**, **Rata-Rata Order Value / AOV**).
   * Detail transaksi historis dengan *Price Snapshot Pattern*.
   * Fitur **Cetak Struk Thermal Digital** (`🖨️ Cetak Struk`) dengan layout print bebas dari Navbar dan tombol navigasi.

---

## 5. Keputusan Teknis & Trade-offs

1. **Server-Side Price Calculation**:
   * *Keputusan*: Harga produk **selalu dihitung ulang di backend** berdasarkan harga di DB saat checkout.
   * *Trade-off*: Mengorbankan sedikit latency HTTP request, namun menjamin **keamanan data 100%** dari manipulasi harga di browser client via DevTools.
2. **Atomic Transaction (`prisma.$transaction`)**:
   * *Keputusan*: Pengecekan stok, pembuatan record transaksi, dan pengurangan stok dibungkus dalam satu transaksi DB.
   * *Trade-off*: Beban query DB sedikit lebih tinggi, namun mencegah masalah *over-selling* dan stok bernilai negatif akibat *race condition*.
3. **Price Snapshot Pattern**:
   * *Keputusan*: Menyimpan `priceAtTime` dan `productName` di tabel `TransactionItem`.
   * *Trade-off*: Redundansi data nama produk, namun menjamin riwayat transaksi masa lalu tetap akurat walaupun produk di katalog diedit/dihapus kelak.

---

## 6. Testing yang Dilakukan

Automated Unit Testing dilakukan pada Backend menggunakan Jest ([`test/products.service.spec.ts`](file:///C:/Users/ahmad/Documents/Project/mini-pos/backend/test/products.service.spec.ts) dan [`test/transactions.service.spec.ts`](file:///C:/Users/ahmad/Documents/Project/mini-pos/backend/test/transactions.service.spec.ts)):

1. **Test Checkout Stock Validation**: Menguji bahwa checkout melempar `BadRequestException` jika stok tidak mencukupi.
2. **Test Inactive Product Checkout**: Menguji bahwa produk nonaktif tidak dapat di-checkout.
3. **Test Atomic Stock Deduction & Total Calculation**: Menguji kelayakan kalkulasi total harga dari server dan kalkulasi pengurangan stok yang tepat.
4. **Test Products CRUD**: Menguji penambahan, pengubahan, dan toggle status produk.

**Hasil Pengujian**: **12/12 Tests PASSED (100% Success Rate)**.

---

## 7. Asumsi Terhadap Requirement

* **Tanpa Otentikasi (No Auth Required)**: Sesuai ketetapan brief, otentikasi tidak diwajibkan sehingga aplikasi langsung fokus pada fungsi utama POS kasir.
* **Perhitungan Pajak/Diskon**: Asumsi awal adalah harga produk yang tertera sudah bersifat bersih (*all-inclusive*).

---

## 8. Laporan Penggunaan AI (AI-Assisted Development)

Sesuai ketentuan transparansi penggunaan AI dalam brief technical test:

* **Tools AI yang Digunakan**: Antigravity AI Pair Programmer (DeepMind Advanced Coding Agent).
* **Peran Pengembang (Human Developer / Technical Lead)**:
  1. **Architectural Governance & Design System**: Merancang struktur arsitektur proyek, mendefinisikan aturan `AGENTS.md`, serta sistem token warna HubSpot di `design.md`.
  2. **Code Review, Debugging & Quality Control**: Memeriksa seluruh baris kode, melakukan refactoring menjadi komponen modular (DRY), men-debug validasi input harga, serta memverifikasi kelulusan 12 unit test Jest dan TypeScript compilation.
  3. **UX & Feature Specification**: Menentukan spesifikasi UX kasir (modal dialog kuantitas `AddToCartModal`, layout responsif 1600px, tombol cetak struk thermal `@media print`, filter kategori produk, dan dashboard analitik omset).
* **Bagian Pekerjaan yang Dibantu AI**:
  1. Scaffolding boilerplate modul NestJS & Vite React.
  2. Pembuatan file mock data seeder ([`prisma/seed.ts`](file:///C:/Users/ahmad/Documents/Project/mini-pos/backend/prisma/seed.ts)).
  3. Pembuatan unit tests di Jest.
* **Cara Output AI Diperiksa & Divalidasi**:
  1. Setiap kompilasi TypeScript divalidasi via `npx tsc --noEmit`.
  2. Pengujian otomatis dijalankan via `npm test`.
  3. Kode diperiksa terhadap kepatuhan prinsip DRY, SOLID, dan keamanan transaksi server-side.
* **Perubahan & Refactoring yang Dilakukan**:
  1. Melakukan refactoring modul UI menjadi komponen atomic (`QuantitySelector`, `PageContainer`, `CartItemRow`, `CartSummaryCard`, `AddToCartModal`).
  2. Menyesuaikan konfigurasi Prisma ORM v7 (`prisma.config.ts` & `@prisma/adapter-pg`).

---

## 9. Keterbatasan Aplikasi & Rencana Pengembangan

* **Keterbatasan**: Saat ini belum mendukung pembayaran terintegrasi dengan Payment Gateway (midtrans/xendit).
* **Rencana Development**: Menambahkan role-based access control (Admin vs Kasir) dan ekspor laporan keuangan format Excel/PDF.

---
*Dokumen ini disusun secara mandiri untuk Submission Technical Test Xolvon Project Incubator Program 2026.*
