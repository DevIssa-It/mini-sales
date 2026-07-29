import React from 'react';

interface PageContainerProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: number | string;
}

export function PageContainer({
  title,
  subtitle,
  action,
  children,
  maxWidth = 1600,
}: PageContainerProps) {
  return (
    <div style={{ width: '100%', maxWidth, margin: '0 auto', padding: '20px 12px' }}>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <div>
          <h1 style={{
            margin: 0,
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--color-text)',
          }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ margin: '4px 0 0', color: 'var(--color-text-muted)', fontSize: 14 }}>
              {subtitle}
            </p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>

      {/* Main Content */}
      {children}
    </div>
  );
}
