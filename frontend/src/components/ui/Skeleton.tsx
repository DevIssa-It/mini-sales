import React from 'react';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className = '', style }: SkeletonProps) {
  return <div className={`skeleton ${className}`} style={style} />;
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="card overflow-hidden">
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
        <Skeleton style={{ height: 14, width: '30%', borderRadius: 4 }} />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{
          display: 'flex', gap: 16, padding: '14px 16px',
          borderBottom: i < rows - 1 ? '1px solid var(--color-border)' : 'none',
          alignItems: 'center',
        }}>
          <Skeleton style={{ height: 14, width: '35%', borderRadius: 4, flexShrink: 0 }} />
          <Skeleton style={{ height: 14, width: '15%', borderRadius: 4, flexShrink: 0 }} />
          <Skeleton style={{ height: 14, width: '10%', borderRadius: 4, flexShrink: 0 }} />
          <Skeleton style={{ height: 22, width: 60, borderRadius: 99, flexShrink: 0 }} />
          <Skeleton style={{ height: 30, width: 80, borderRadius: 8, marginLeft: 'auto', flexShrink: 0 }} />
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Skeleton style={{ height: 18, width: '70%', borderRadius: 4 }} />
          <Skeleton style={{ height: 14, width: '40%', borderRadius: 4 }} />
          <Skeleton style={{ height: 14, width: '30%', borderRadius: 4 }} />
          <Skeleton style={{ height: 34, borderRadius: 8 }} />
        </div>
      ))}
    </div>
  );
}
