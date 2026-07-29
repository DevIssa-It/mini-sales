# Mini POS — Point of Sale Application

Aplikasi Mini POS full-stack untuk Xolvon Web Developer Technical Test.

## Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | Vite + React 19 + TypeScript |
| Backend | NestJS + TypeScript |
| Database | PostgreSQL + Prisma ORM |
| State | Zustand |
| Styling | Tailwind CSS v4 |
| Testing | Jest + @nestjs/testing |
| Deployment | Vercel (FE) + Railway (BE) |

## Fitur

- **Manajemen Produk**: Tambah, edit, aktif/nonaktif
- **Keranjang**: Tambah/hapus/ubah qty, validasi stok
- **Checkout**: Server-side price validation, atomic stock deduction
- **Riwayat Transaksi**: Daftar & detail transaksi dengan snapshot harga

## Cara Instalasi

### Prerequisites
- Node.js >= 18
- PostgreSQL database (local atau Supabase)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env dengan DATABASE_URL Anda
npx prisma generate
npm run db:push
npm run db:seed    # (opsional) isi data contoh
npm run start:dev
```

Backend berjalan di `http://localhost:3000/api`

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Edit VITE_API_URL jika backend tidak di localhost:3000
npm run dev
```

Frontend berjalan di `http://localhost:5173`

## Environment Variables

### Backend (`backend/.env`)

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:3000/api
```

## Menjalankan Tests

```bash
cd backend
npm test            # unit tests
npm run test:cov    # dengan coverage
```

## API Endpoints

```
GET    /api/products              Daftar produk
POST   /api/products              Tambah produk
PUT    /api/products/:id          Update produk
PATCH  /api/products/:id/status   Toggle aktif/nonaktif

GET    /api/transactions          Riwayat transaksi
POST   /api/transactions/checkout Checkout
GET    /api/transactions/:id      Detail transaksi
```

## Deployment & Repository Links

- **Frontend App**: [https://mini-sales.vercel.app](https://mini-sales.vercel.app)
- **Backend API**: [https://mini-sales-production.up.railway.app/api](https://mini-sales-production.up.railway.app/api)
- **GitHub Repository**: [https://github.com/DevIssa-It/mini-sales](https://github.com/DevIssa-It/mini-sales)

## Author

Ahmad — Xolvon Web Developer Technical Test (Juli 2026)

