import { Plus, Minus } from '@phosphor-icons/react';

interface QuantitySelectorProps {
  value: number;
  min?: number;
  max: number;
  onChange: (quantity: number) => void;
  idPrefix?: string;
}

export function QuantitySelector({
  value,
  min = 1,
  max,
  onChange,
  idPrefix = 'qty',
}: QuantitySelectorProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <button
        type="button"
        className="btn btn-ghost btn-icon btn-sm"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Kurangi jumlah"
        id={`btn-decrease-${idPrefix}`}
      >
        <Minus size={14} />
      </button>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          const val = parseInt(e.target.value) || min;
          onChange(Math.min(max, Math.max(min, val)));
        }}
        style={{
          width: 58,
          height: 36,
          textAlign: 'center',
          fontSize: 14,
          fontWeight: 600,
          padding: '4px 6px',
          border: '1.5px solid var(--color-border)',
          borderRadius: 8,
          fontFamily: 'var(--font-sans)',
        }}
        id={`input-qty-${idPrefix}`}
      />
      <button
        type="button"
        className="btn btn-ghost btn-icon btn-sm"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Tambah jumlah"
        id={`btn-increase-${idPrefix}`}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
