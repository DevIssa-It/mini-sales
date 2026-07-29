import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ClockCounterClockwise, ArrowRight, CurrencyDollar, Receipt, ChartLineUp } from '@phosphor-icons/react';
import { getTransactions } from '../lib/api';
import { formatCurrency, formatDate } from '../lib/utils';
import { TableSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { PageContainer } from '../components/layout/PageContainer';
import type { Transaction } from '../types';

export default function TransactionsPage() {
  const navigate = useNavigate();

  const { data: transactions = [], isLoading, error } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: getTransactions,
  });

  // Calculate Sales Summary Metrics
  const totalOmset = transactions.reduce((acc, t) => acc + Number(t.total), 0);
  const totalTxnCount = transactions.length;
  const avgOrderValue = totalTxnCount > 0 ? totalOmset / totalTxnCount : 0;

  return (
    <PageContainer
      title="Riwayat & Analitik Penjualan"
      subtitle={`${transactions.length} transaksi tercatat`}
    >
      {/* Analytics Metric Cards */}
      {!isLoading && !error && transactions.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}>
          <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: 'var(--color-primary-light)', color: 'var(--color-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CurrencyDollar size={24} weight="bold" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Pendapatan
              </p>
              <p style={{ margin: '2px 0 0', fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--color-primary)' }}>
                {formatCurrency(totalOmset)}
              </p>
            </div>
          </div>

          <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: 'var(--color-accent-light)', color: 'var(--color-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Receipt size={24} weight="bold" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Transaksi
              </p>
              <p style={{ margin: '2px 0 0', fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                {totalTxnCount} Transaksi
              </p>
            </div>
          </div>

          <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: 'var(--color-surface-2)', color: 'var(--color-text)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ChartLineUp size={24} weight="bold" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Rata-rata Order (AOV)
              </p>
              <p style={{ margin: '2px 0 0', fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                {formatCurrency(avgOrderValue)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Table content */}
      {isLoading ? (
        <TableSkeleton rows={6} />
      ) : error ? (
        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
          <p style={{ color: 'var(--color-danger)', fontSize: 14 }}>Gagal memuat transaksi.</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<ClockCounterClockwise size={28} />}
            title="Belum ada transaksi"
            description="Lakukan checkout pertama Anda untuk melihat riwayat transaksi di sini."
          />
        </div>
      ) : (
        <div className="card">
          <table className="table-base">
            <thead>
              <tr>
                <th>ID Transaksi</th>
                <th>Waktu</th>
                <th>Jumlah Item</th>
                <th>Total</th>
                <th style={{ textAlign: 'right' }}>Detail</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr
                  key={txn.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/transactions/${txn.id}`)}
                >
                  <td>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-text-muted)' }}>
                      {txn.id.slice(0, 12)}...
                    </code>
                  </td>
                  <td style={{ fontSize: 13 }}>{formatDate(txn.createdAt)}</td>
                  <td>
                    <span className="badge badge-neutral">
                      {txn._count?.items ?? txn.items?.length ?? 0} item
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--color-primary)' }}>
                      {formatCurrency(txn.total)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={(e) => { e.stopPropagation(); navigate(`/transactions/${txn.id}`); }}
                      id={`btn-detail-${txn.id}`}
                    >
                      Lihat <ArrowRight size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageContainer>
  );
}
