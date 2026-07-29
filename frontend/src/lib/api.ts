import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Standardize error messages with clear network/gateway error detection
api.interceptors.response.use(
  (res) => res,
  (error) => {
    let message: string;

    if (!error.response) {
      // Network error or CORS / Gateway failure (502 / Offline)
      message =
        'Gagal terhubung ke server API (CORS / Network Error / Backend offline). Harap periksa status server backend di Railway.';
    } else if (error.response.status === 502) {
      message =
        'Server Backend (Railway) mengalami 502 Bad Gateway. Harap periksa koneksi database di Railway.';
    } else {
      const serverMsg = error.response.data?.message;
      message = Array.isArray(serverMsg)
        ? serverMsg[0]
        : serverMsg || error.message || 'Terjadi kesalahan pada server';
    }

    return Promise.reject(new Error(message));
  },
);

export default api;

// ---- Products ----
export const getProducts = (activeOnly?: boolean) =>
  api.get('/products', { params: activeOnly ? { active: 'true' } : {} }).then((r) => r.data);

export const createProduct = (data: { name: string; price: number; stock: number; imageUrl?: string }) =>
  api.post('/products', data).then((r) => r.data);

export const updateProduct = (id: string, data: Partial<{ name: string; price: number; stock: number; imageUrl?: string; isActive: boolean }>) =>
  api.put(`/products/${id}`, data).then((r) => r.data);

export const toggleProductStatus = (id: string) =>
  api.patch(`/products/${id}/status`).then((r) => r.data);

// ---- Transactions ----
export const getTransactions = () =>
  api.get('/transactions').then((r) => r.data);

export const getTransaction = (id: string) =>
  api.get(`/transactions/${id}`).then((r) => r.data);

export const checkout = (items: { productId: string; quantity: number }[]) =>
  api.post('/transactions/checkout', { items }).then((r) => r.data);
