import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from '@phosphor-icons/react';
import { getTransaction } from '../lib/api';
import { Skeleton } from '../components/ui/Skeleton';
import { TransactionReceipt } from '../components/transactions/TransactionReceipt';
import type { Transaction } from '../types';

export default function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: txn, isLoading, error } = useQuery<Transaction>({
    queryKey: ['transaction', id],
    queryFn: () => getTransaction(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div style={{ maxWidth: 640, margin: '32px auto', padding: '0 24px' }}>
        <Skeleton style={{ height: 20, width: 120, marginBottom: 24, borderRadius: 6 }} />
        <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} style={{ height: 16, width: `${60 + i * 10}%`, borderRadius: 4 }} />
          ))}
        </div>
      </div>
    );
  }

  if (error || !txn) {
    return (
      <div style={{ maxWidth: 640, margin: '32px auto', padding: '0 24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-danger)', fontSize: 14, marginBottom: 16 }}>
          Transaksi tidak ditemukan.
        </p>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/transactions')}>
          <ArrowLeft size={14} /> Kembali
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 32px' }}>
      <button
        className="btn btn-ghost btn-sm no-print"
        onClick={() => navigate('/transactions')}
        style={{ marginBottom: 24 }}
      >
        <ArrowLeft size={14} /> Riwayat Transaksi
      </button>

      <TransactionReceipt transaction={txn} />
    </div>
  );
}
