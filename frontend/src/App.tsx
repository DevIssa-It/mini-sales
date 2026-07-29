import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/layout/Navbar';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import TransactionsPage from './pages/TransactionsPage';
import TransactionDetailPage from './pages/TransactionDetailPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 30,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div style={{ minHeight: '100dvh', background: 'var(--color-background)' }}>
          <Navbar />
          <main>
            <Routes>
              <Route path="/"                     element={<ProductsPage />} />
              <Route path="/cart"                 element={<CartPage />} />
              <Route path="/transactions"         element={<TransactionsPage />} />
              <Route path="/transactions/:id"     element={<TransactionDetailPage />} />
            </Routes>
          </main>
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              fontFamily: 'var(--font-sans)',
              fontSize: 14,
              borderRadius: 10,
              border: '1px solid var(--color-border)',
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
