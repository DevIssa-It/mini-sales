import React from 'react';
import { NavLink } from 'react-router-dom';
import { Storefront, ShoppingCart, ClockCounterClockwise, Package } from '@phosphor-icons/react';
import { useCartStore } from '../../store/cartStore';

const navItems = [
  { to: '/',             label: 'Produk',    icon: Package },
  { to: '/cart',         label: 'Keranjang', icon: ShoppingCart },
  { to: '/transactions', label: 'Riwayat',   icon: ClockCounterClockwise },
];

function CartBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span style={{
      minWidth: 18, height: 18, borderRadius: 99,
      background: 'var(--color-accent)', color: '#fff',
      fontSize: 11, fontWeight: 700, display: 'inline-flex',
      alignItems: 'center', justifyContent: 'center',
      padding: '0 5px', marginLeft: 2,
    }}>
      {count}
    </span>
  );
}

export function Navbar() {
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'var(--color-primary)', borderBottom: '1px solid rgba(255,255,255,0.08)',
      height: 64,
    }}>
      <div style={{
        maxWidth: 1600, margin: '0 auto', padding: '0 12px',
        height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#fff' }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Storefront size={20} weight="fill" />
          </div>
          <div>
            <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em' }}>Mini POS</span>
            <span style={{ fontSize: 10, opacity: 0.6, display: 'block', lineHeight: 1, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Point of Sale</span>
          </div>
        </NavLink>

        {/* Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 8, textDecoration: 'none',
                fontSize: 14, fontWeight: 500, transition: 'background 150ms',
                color: isActive ? '#ffffff' : 'rgba(255,255,255,0.65)',
                background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon size={17} weight={isActive ? 'fill' : 'regular'} />
                  {label}
                  {label === 'Keranjang' && <CartBadge count={totalItems} />}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
