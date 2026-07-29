import { Warning } from '@phosphor-icons/react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'primary' | 'accent' | 'danger';
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = 'Konfirmasi',
  cancelLabel = 'Batal',
  variant = 'primary',
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const btnClass =
    variant === 'accent' ? 'btn-accent' :
    variant === 'danger' ? 'btn-danger' :
    'btn-primary';

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 110,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="card" style={{ width: '100%', maxWidth: 420, padding: 24 }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: variant === 'danger' ? 'var(--color-danger-light)' : 'var(--color-primary-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: variant === 'danger' ? 'var(--color-danger)' : 'var(--color-primary)',
            flexShrink: 0,
          }}>
            <Warning size={22} weight="bold" />
          </div>
          <div>
            <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: 'var(--color-text)' }}>
              {title}
            </h3>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
              {description}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel} disabled={isPending}>
            {cancelLabel}
          </button>
          <button type="button" className={`btn btn-sm ${btnClass}`} onClick={onConfirm} disabled={isPending}>
            {isPending ? 'Memproses...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
