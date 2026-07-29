import { Printer } from '@phosphor-icons/react';
import { formatCurrency, formatDate } from '../../lib/utils';
import type { Transaction } from '../../types';

interface TransactionReceiptProps {
  transaction: Transaction;
  showHeader?: boolean;
}

export function TransactionReceipt({ transaction, showHeader = true }: TransactionReceiptProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      {/* Optional Header */}
      {showHeader && (
        <div style={{
          padding: '20px 24px',
          background: 'var(--color-primary)',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
          <div>
            <p style={{ margin: '0 0 4px', fontSize: 11, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Detail Transaksi
            </p>
            <p style={{ margin: '0 0 4px', fontFamily: 'var(--font-mono)', fontSize: 13, opacity: 0.85 }}>
              ID: {transaction.id}
            </p>
            <p style={{ margin: 0, fontSize: 13, opacity: 0.75 }}>
              {formatDate(transaction.createdAt)}
            </p>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm no-print"
            onClick={handlePrint}
            style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
            title="Cetak Struk Transaksi"
          >
            <Printer size={16} /> Cetak Struk
          </button>
        </div>
      )}

      {/* Items list */}
      <div className="card-surface">
        {transaction.items.map((item, idx) => (
          <div key={item.id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            padding: '12px 20px',
            borderBottom: idx < transaction.items.length - 1 ? '1px solid var(--color-border)' : 'none',
          }}>
            <div>
              <p style={{ margin: 0, fontWeight: 500, fontSize: 14 }}>{item.productName}</p>
              <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--color-text-muted)' }}>
                {formatCurrency(item.priceAtTime)} × {item.quantity}
              </p>
            </div>
            <span style={{ fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-mono)' }}>
              {formatCurrency(item.subtotal)}
            </span>
          </div>
        ))}
      </div>

      {/* Total Footer */}
      <div style={{
        padding: '16px 20px',
        background: 'var(--color-surface)',
        borderTop: '2px solid var(--color-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontWeight: 700, fontSize: 15 }}>Total Transaksi</span>
        <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
          {formatCurrency(transaction.total)}
        </span>
      </div>
    </div>
  );
}
