import React, { useState } from 'react';
import { ShoppingCart, X } from '@phosphor-icons/react';
import { formatCurrency } from '../../lib/utils';
import { QuantitySelector } from '../ui/QuantitySelector';
import type { Product } from '../../types';

interface AddToCartModalProps {
  product: Product;
  currentInCart: number;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
}

export function AddToCartModal({
  product,
  currentInCart,
  isOpen,
  onClose,
  onConfirm,
}: AddToCartModalProps) {
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) return null;

  const availableStock = product.stock - currentInCart;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0 || quantity > availableStock) return;
    onConfirm(quantity);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 110,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="card" style={{ width: '100%', maxWidth: 400, padding: 0 }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShoppingCart size={20} color="var(--color-primary)" weight="bold" />
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Tambah ke Keranjang</h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-icon btn-sm" aria-label="Tutup">
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} style={{ padding: 20 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: 12, borderRadius: 10,
            background: 'var(--color-surface-2)',
            marginBottom: 20,
          }}>
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }}
              />
            ) : (
              <div style={{
                width: 48, height: 48, borderRadius: 8,
                background: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 18,
              }}>
                {product.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>{product.name}</p>
              <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                {formatCurrency(product.price)}
              </p>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--color-text-light)' }}>
                Stok tersedia: {product.stock} {currentInCart > 0 && `(${currentInCart} di keranjang)`}
              </p>
            </div>
          </div>

          {/* Quantity Selector Input */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 24, padding: '12px 16px',
            border: '1.5px solid var(--color-border)', borderRadius: 10,
          }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Pilih Jumlah Barang:</span>
            <QuantitySelector
              value={quantity}
              min={1}
              max={availableStock}
              onChange={(q) => setQuantity(q)}
              idPrefix="modal-add"
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={availableStock <= 0}
            >
              + Tambah ({quantity}) Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
