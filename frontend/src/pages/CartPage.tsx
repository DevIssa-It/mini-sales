import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingCart, Trash, Package } from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import { useCartStore } from '../store/cartStore';
import { checkout } from '../lib/api';
import { formatCurrency } from '../lib/utils';
import { PageContainer } from '../components/layout/PageContainer';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { CheckoutSuccessView } from '../components/cart/CheckoutSuccessView';
import { CartItemRow } from '../components/cart/CartItemRow';
import { CartSummaryCard } from '../components/cart/CartSummaryCard';
import type { Transaction } from '../types';

export default function CartPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { items, removeItem, updateQuantity, clearCart, total } = useCartStore();

  const [checkoutResult, setCheckoutResult] = useState<Transaction | null>(null);
  const [showCheckoutConfirm, setShowCheckoutConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const checkoutMutation = useMutation({
    mutationFn: () =>
      checkout(items.map((i) => ({ productId: i.product.id, quantity: i.quantity }))),
    onSuccess: (data: Transaction) => {
      setShowCheckoutConfirm(false);
      clearCart();
      setCheckoutResult(data);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transaksi berhasil!', { duration: 3000 });
    },
    onError: (err: Error) => {
      setShowCheckoutConfirm(false);
      toast.error(err.message, { duration: 5000 });
    },
  });

  // Success view
  if (checkoutResult) {
    return (
      <CheckoutSuccessView
        transaction={checkoutResult}
        onNewTransaction={() => { setCheckoutResult(null); navigate('/'); }}
      />
    );
  }

  return (
    <PageContainer title="Keranjang Belanja" subtitle={`${items.length} jenis produk`}>
      {items.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<ShoppingCart size={28} />}
            title="Keranjang kosong"
            description="Tambahkan produk dari halaman Produk untuk memulai transaksi."
            action={
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/')}>
                <Package size={14} /> Pilih Produk
              </button>
            }
          />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
          {/* Cart items list */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{
              padding: '14px 20px',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>Item Keranjang</span>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setShowClearConfirm(true)}
              >
                <Trash size={14} /> Kosongkan
              </button>
            </div>

            {items.map((item) => (
              <CartItemRow
                key={item.product.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
              />
            ))}
          </div>

          {/* Sticky Order summary */}
          <CartSummaryCard
            items={items}
            total={total()}
            onCheckout={() => setShowCheckoutConfirm(true)}
            isPending={checkoutMutation.isPending}
          />
        </div>
      )}

      {/* Confirmation Modal — Checkout */}
      <ConfirmDialog
        isOpen={showCheckoutConfirm}
        title="Konfirmasi Checkout"
        description={`Proses transaksi dengan total ${formatCurrency(total())}? Stok akan otomatis dikurangi setelah transaksi berhasil.`}
        confirmLabel="Ya, Checkout Sekarang"
        variant="accent"
        isPending={checkoutMutation.isPending}
        onConfirm={() => checkoutMutation.mutate()}
        onCancel={() => setShowCheckoutConfirm(false)}
      />

      {/* Confirmation Modal — Kosongkan Keranjang */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        title="Kosongkan Keranjang?"
        description="Seluruh item yang ada di keranjang belanja akan dihapus."
        confirmLabel="Ya, Kosongkan"
        variant="danger"
        onConfirm={() => {
          clearCart();
          setShowClearConfirm(false);
          toast.success('Keranjang dikosongkan');
        }}
        onCancel={() => setShowClearConfirm(false)}
      />
    </PageContainer>
  );
}
