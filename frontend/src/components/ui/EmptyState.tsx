import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      textAlign: 'center',
      gap: 12,
    }}>
      {icon && (
        <div style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'var(--color-surface-2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-text-light)',
          marginBottom: 4,
        }}>
          {icon}
        </div>
      )}
      <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>
        {title}
      </p>
      {description && (
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', margin: 0, maxWidth: 320 }}>
          {description}
        </p>
      )}
      {action && <div style={{ marginTop: 8 }}>{action}</div>}
    </div>
  );
}
