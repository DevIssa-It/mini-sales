import React from 'react';
import { Trash } from '@phosphor-icons/react';
import { formatCurrency } from '../../lib/utils';
import { QuantitySelector } from '../ui/QuantitySelector';
import type { CartItem } from '../../types';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

export function CartItemRow({ item, onUpdateQuantity, onRemoveItem }: CartItemRowProps) {
  const subtotal = Number(item.product.price) * item.quantity;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '14px 20px',
      borderBottom: '1px solid var(--color-border)',
    }}>
      {/* Thumbnail */}
      {item.product.imageUrl ? (
        <img
          src={item.product.imageUrl}
          alt={item.product.name}
          style={{
            width: 44, height: 44, borderRadius: 10,
            objectFit: 'cover', background: 'var(--color-surface-2)',
            flexShrink: 0,
          }}
        />
      ) : (
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: 'var(--color-surface-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--color-text-muted)', fontSize: 16, fontWeight: 700,
          flexShrink: 0,
        }}>
          {item.product.name.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Product info */}
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontWeight: 500, fontSize: 14 }}>{item.product.name}</p>
        <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--color-text-muted)' }}>
          {formatCurrency(item.product.price)} / item
        </p>
        <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--color-text-light)' }}>
          Stok tersedia: {item.product.stock}
        </p>
      </div>

      {/* Quantity selector */}
      <QuantitySelector
        value={item.quantity}
        max={item.product.stock}
        onChange={(q) => onUpdateQuantity(item.product.id, q)}
        idPrefix={item.product.id}
      />

      {/* Subtotal */}
      <div style={{ minWidth: 96, textAlign: 'right' }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-mono)' }}>
          {formatCurrency(subtotal)}
        </p>
      </div>

      {/* Hapus button */}
      <button
        className="btn btn-ghost btn-icon btn-sm"
        onClick={() => onRemoveItem(item.product.id)}
        aria-label="Hapus item"
        id={`btn-remove-${item.product.id}`}
        style={{ color: 'var(--color-danger)' }}
      >
        <Trash size={15} />
      </button>
    </div>
  );
}
