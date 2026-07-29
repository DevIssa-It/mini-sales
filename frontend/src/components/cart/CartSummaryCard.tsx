import React from 'react';
import { ArrowRight } from '@phosphor-icons/react';
import { formatCurrency } from '../../lib/utils';
import type { CartItem } from '../../types';

interface CartSummaryCardProps {
  items: CartItem[];
  total: number;
  onCheckout: () => void;
  isPending: boolean;
}

export function CartSummaryCard({ items, total, onCheckout, isPending }: CartSummaryCardProps) {
  return (
    <div style={{ position: 'sticky', top: 80 }}>
      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600 }}>Ringkasan Pesanan</h3>

        {/* Itemized preview */}
        {items.map((item) => (
          <div key={item.product.id} style={{
            display: 'flex', justifyContent: 'space-between',
            marginBottom: 8, fontSize: 13,
          }}>
            <span style={{ color: 'var(--color-text-muted)' }}>
              {item.product.name} ×{item.quantity}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>
              {formatCurrency(Number(item.product.price) * item.quantity)}
            </span>
          </div>
        ))}

        {/* Total & Checkout Button */}
        <div style={{ borderTop: '1px solid var(--color-border)', marginTop: 12, paddingTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>Total</span>
            <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
              {formatCurrency(total)}
            </span>
          </div>
          <button
            className="btn btn-accent"
            style={{ width: '100%', justifyContent: 'center', padding: '11px 20px' }}
            onClick={onCheckout}
            disabled={isPending || items.length === 0}
            id="btn-checkout"
          >
            {isPending ? 'Memproses...' : (
              <><ArrowRight size={16} weight="bold" /> Checkout</>
            )}
          </button>
        </div>

        <p style={{ fontSize: 11, color: 'var(--color-text-light)', marginTop: 12, textAlign: 'center' }}>
          Harga dan stok divalidasi oleh server saat checkout.
        </p>
      </div>
    </div>
  );
}
