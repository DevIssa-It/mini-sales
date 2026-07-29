import React, { useState } from 'react';
import { ShoppingCartSimple, PencilSimple, Eye, EyeSlash } from '@phosphor-icons/react';
import { formatCurrency } from '../../lib/utils';
import { AddToCartModal } from '../cart/AddToCartModal';
import type { Product } from '../../types';

interface ProductTableRowProps {
  product: Product;
  cartQuantity: number;
  onAddToCart: (p: Product, qty: number) => void;
  onEdit: (p: Product) => void;
  onToggleStatus: (id: string) => void;
  isTogglePending: boolean;
}

export function ProductTableRow({
  product,
  cartQuantity,
  onAddToCart,
  onEdit,
  onToggleStatus,
  isTogglePending,
}: ProductTableRowProps) {
  const [showQtyModal, setShowQtyModal] = useState(false);

  return (
    <>
      <tr>
        {/* Product Thumbnail & Name */}
        <td>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{
                  width: 36, height: 36, borderRadius: 8,
                  objectFit: 'cover', background: 'var(--color-surface-2)',
                  flexShrink: 0,
                }}
              />
            ) : (
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: 'var(--color-surface-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-text-muted)', fontSize: 14, fontWeight: 700,
                flexShrink: 0,
              }}>
                {product.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <span style={{ fontWeight: 500, color: product.isActive ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
                {product.name}
              </span>
              {cartQuantity > 0 && (
                <span className="badge badge-neutral" style={{ marginLeft: 8, fontSize: 10 }}>
                  {cartQuantity} di keranjang
                </span>
              )}
            </div>
          </div>
        </td>

        {/* Price */}
        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>
          {formatCurrency(product.price)}
        </td>

        {/* Stock */}
        <td>
          <span style={{
            fontWeight: 600,
            color: product.stock === 0 ? 'var(--color-danger)' :
                   product.stock <= 5 ? 'var(--color-warning)' :
                   'var(--color-text)',
          }}>
            {product.stock}
          </span>
          {product.stock === 0 && (
            <span className="badge badge-danger" style={{ marginLeft: 8, fontSize: 10 }}>Habis</span>
          )}
        </td>

        {/* Status */}
        <td>
          <span className={`badge ${product.isActive ? 'badge-success' : 'badge-neutral'}`}>
            {product.isActive ? 'Aktif' : 'Nonaktif'}
          </span>
        </td>

        {/* Action Buttons */}
        <td>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
            {product.isActive && product.stock > 0 && (
              <button
                className="btn btn-ghost btn-sm btn-icon"
                title="Tambah ke keranjang"
                onClick={() => setShowQtyModal(true)}
                id={`btn-add-cart-${product.id}`}
              >
                <ShoppingCartSimple size={15} />
              </button>
            )}
            <button
              className="btn btn-ghost btn-sm btn-icon"
              title="Edit produk"
              onClick={() => onEdit(product)}
              id={`btn-edit-${product.id}`}
            >
              <PencilSimple size={15} />
            </button>
            <button
              className={`btn btn-sm btn-icon ${product.isActive ? 'btn-danger' : 'btn-outline'}`}
              title={product.isActive ? 'Nonaktifkan' : 'Aktifkan'}
              onClick={() => onToggleStatus(product.id)}
              disabled={isTogglePending}
              id={`btn-toggle-${product.id}`}
            >
              {product.isActive ? <EyeSlash size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </td>
      </tr>

      {/* Add To Cart Quantity Modal */}
      {showQtyModal && (
        <AddToCartModal
          product={product}
          currentInCart={cartQuantity}
          isOpen={showQtyModal}
          onClose={() => setShowQtyModal(false)}
          onConfirm={(qty) => onAddToCart(product, qty)}
        />
      )}
    </>
  );
}
