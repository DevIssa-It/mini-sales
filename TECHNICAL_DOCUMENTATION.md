# Dokumentasi Submission Technical Test — Mini POS

Dokumen ini disusun sebagai bagian dari berkas pengumpulan Technical Test Web Developer Xolvon Project Incubator Program 2026.

---

## 1. Gambaran Aplikasi

**Mini POS (Point of Sale)** adalah aplikasi sistem kasir full-stack berbasis web yang dirancang untuk mengelola katalog produk, proses keranjang belanja, validasi stok real-time, transaksi pembayaran dengan kalkulasi server-side, serta riwayat transaksi dengan snapshot harga historis.

Aplikasi ini mengutamakan **kestabilan, integritas data finansial/stok, serta kesederhanaan penggunaan (User Experience)** sesuai dengan prinsip utama dalam brief.

---

## 2. Arsitektur Aplikasi & Database

Aplikasi menerapkan **Decoupled Architecture** (Frontend & Backend terpisah) untuk menjamin independensi deployment, skalabilitas, serta fleksibilitas integrasi.

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

* **`Product`**: `id` (String UUID), `name` (String), `price` (Decimal), `stock` (Int), `isActive` (Boolean), `createdAt`, `updatedAt`.
* **`Transaction`**: `id` (String UUID), `total` (Decimal), `createdAt`.
* **`TransactionItem`**: `id` (String UUID), `transactionId` (FK), `productId` (FK), `productName` (String - Snapshot), `priceAtTime` (Decimal - Snapshot), `quantity` (Int), `subtotal` (Decimal).

---

## 3. Teknologi yang Digunakan & Rationale

| Layer | Teknologi | Alasan Pemilihan |
|---|---|---|
| **Backend** | NestJS + TypeScript | Arsitektur modular standar industri dengan *Dependency Injection* bawaan. Memisahkan controller, service, dan DTO secara terstruktur. |
| **Database ORM** | Prisma ORM 7 + PostgreSQL | Type-safety penuh dari skema database, dukungan tipe data `Decimal` untuk presisi uang, serta transaksi atomik (`$transaction`). |
| **Frontend** | Vite + React 19 + TypeScript | SPA ultra-cepat dengan waktu *cold-build* instant, cocok untuk alat operasional internal kasir yang butuh navigasi tanpa reload. |
| **State Management** | Zustand (Cart) + React Query (Server) | Zustand mengelola state keranjang lokal dengan persistence `localStorage`. React Query mengelola caching & auto-fetching data produk dari server. |
| **Styling** | Tailwind CSS v4 + Design System Tokens | Kustomisasi variabel CSS terinspirasi dari HubSpot Design System (Professional B2B Teal Palette) untuk tampilan bersih dan ergonomis. |

---

## 4. Fitur Selesai vs Belum Selesai

### ✅ Fitur Selesai (100% Core Requirements Met):
1. **Manajemen Produk**: Tampil daftar produk, tambah produk baru, edit nama/harga/stok, serta toggle status aktif/nonaktif.
2. **Keranjang Belanja**: Tambah/hapus item, ubah jumlah kuantitas, hitung subtotal & total, serta validasi batas stok secara real-time.
3. **Checkout Transaksi**: Validasi stok & status produk di server-side, kalkulasi total terpusat di backend, transaksi atomik database, serta pencegahan stok negatif.
4. **Riwayat & Detail Transaksi**: Daftar transaksi historis, pencatatan waktu & total, serta detail struk transaksi menggunakan snapshot harga saat beli.

### 🔮 Rencana Fitur Tambahan (Future Enhancement):
* Fitur pencetakan struk fisik (Thermal Printer PDF export).
* Fitur Laporan Analitik Penjualan (Harian/Bulanan).

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

Sesuai ketentuan transparansi penggunaan AI dalam brief:

* **Tools AI yang Digunakan**: Antigravity AI Pair Programmer (DeepMind Advanced Coding Agent).
* **Bagian Pekerjaan yang Dibantu AI**:
  1. Scaffolding awal struktur modul NestJS & Vite React.
  2. Pembuatan file mock data seeder ([`prisma/seed.ts`](file:///C:/Users/ahmad/Documents/Project/mini-pos/backend/prisma/seed.ts)).
  3. Pembuatan unit tests di Jest.
* **Cara Output AI Diperiksa & Divalidasi**:
  1. Setiap kompilasi TypeScript divalidasi via `npx tsc --noEmit`.
  2. Pengujian otomatis dijalankan via `npm test`.
  3. Kode diperiksa terhadap kepatuhan prinsip DRY, SOLID, dan tidak ada hardcoded credentials.
* **Perubahan yang Dilakukan Terhadap Output AI**:
  1. Melakukan refactoring modul UI menjadi komponen atomic (`QuantitySelector`, `PageContainer`, `CartItemRow`, `CartSummaryCard`).
  2. Menyesuaikan konfigurasi Prisma ORM v7 (`prisma.config.ts` & `@prisma/adapter-pg`).

---

## 9. Keterbatasan Aplikasi & Rencana Pengembangan

* **Keterbatasan**: Saat ini belum mendukung pembayaran terintegrasi dengan Payment Gateway (midtrans/xendit).
* **Rencana Development**: Menambahkan role-based access control (Admin vs Kasir) dan ekspor laporan keuangan format Excel/PDF.

---
*Dokumen ini disusun secara mandiri untuk Submission Technical Test Xolvon Project Incubator Program 2026.*
