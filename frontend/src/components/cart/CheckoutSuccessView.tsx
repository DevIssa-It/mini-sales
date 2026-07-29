import { useNavigate } from 'react-router-dom';
import { TransactionReceipt } from '../transactions/TransactionReceipt';
import type { Transaction } from '../../types';

interface CheckoutSuccessViewProps {
  transaction: Transaction;
  onNewTransaction: () => void;
}

export function CheckoutSuccessView({ transaction, onNewTransaction }: CheckoutSuccessViewProps) {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 560, margin: '60px auto', padding: '0 24px', textAlign: 'center' }}>
      <div className="card" style={{ padding: 32 }}>
        {/* Success Icon */}
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'var(--color-success-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
          fontSize: 28,
        }}>✓</div>

        <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700 }}>
          Transaksi Berhasil
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14, margin: '0 0 24px' }}>
          ID: <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{transaction.id}</code>
        </p>

        {/* Struk Summary */}
        <div style={{ marginBottom: 20, textAlign: 'left' }}>
          <TransactionReceipt transaction={transaction} showHeader={false} />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="btn btn-ghost"
            style={{ flex: 1 }}
            onClick={() => navigate('/transactions')}
          >
            Lihat Riwayat
          </button>
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={onNewTransaction}
          >
            Transaksi Baru
          </button>
        </div>
      </div>
    </div>
  );
}
