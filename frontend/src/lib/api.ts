import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Standardize error messages
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.message ||
      (Array.isArray(error.response?.data?.message)
        ? error.response.data.message[0]
        : null) ||
      error.message ||
      'Terjadi kesalahan';
    return Promise.reject(new Error(Array.isArray(message) ? message[0] : message));
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
