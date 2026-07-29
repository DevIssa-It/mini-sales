import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import { createProduct, updateProduct } from '../../lib/api';
import { FormField } from '../ui/FormField';
import type { Product } from '../../types';

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
}

const CATEGORY_OPTIONS = ['Minuman', 'Makanan', 'Snack', 'Lainnya'];

export function ProductForm({ product, onClose }: ProductFormProps) {
  const queryClient = useQueryClient();
  const isEdit = !!product;

  const [form, setForm] = useState({
    name:     product?.name    ?? '',
    price:    product?.price   ? String(product.price) : '',
    stock:    product?.stock   != null ? String(product.stock) : '',
    category: product?.category ?? 'Minuman',
    imageUrl: product?.imageUrl ?? '',
    isActive: product?.isActive ?? true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())                       e.name  = 'Nama produk wajib diisi';
    if (!form.price || Number(form.price) <= 0) e.price = 'Harga harus lebih dari 0';
    if (form.stock === '' || Number(form.stock) < 0) e.stock = 'Stok tidak boleh negatif';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const mutation = useMutation({
    mutationFn: (data: { name: string; price: number; stock: number; category?: string; imageUrl?: string; isActive?: boolean }) =>
      isEdit ? updateProduct(product!.id, data) : createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(isEdit ? 'Produk diperbarui' : 'Produk ditambahkan');
      onClose();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    mutation.mutate({
      name:     form.name.trim(),
      price:    Number(form.price),
      stock:    Number(form.stock),
      category: form.category,
      imageUrl: form.imageUrl.trim() || undefined,
      isActive: form.isActive,
    });
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.45)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 24,
    }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="card" style={{ width: '100%', maxWidth: 480, padding: 0 }}>
        {/* Header */}
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>
            {isEdit ? 'Edit Produk' : 'Tambah Produk'}
          </h2>
          <button onClick={onClose} className="btn btn-ghost btn-icon btn-sm" aria-label="Tutup">
            <X size={16} />
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <FormField label="Nama Produk" required error={errors.name}>
            <input
              className={`input ${errors.name ? 'input-error' : ''}`}
              placeholder="cth. Kopi Americano"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              maxLength={100}
            />
          </FormField>

          {/* Price & Stock */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Harga (Rp)" required error={errors.price}>
              <input
                className={`input ${errors.price ? 'input-error' : ''}`}
                type="number" min="1" placeholder="25000"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              />
            </FormField>

            <FormField label="Stok" required error={errors.stock}>
              <input
                className={`input ${errors.stock ? 'input-error' : ''}`}
                type="number" min="0" step="1" placeholder="50"
                value={form.stock}
                onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
              />
            </FormField>
          </div>

          {/* Category Dropdown */}
          <FormField label="Kategori Produk">
            <select
              className="input"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              style={{ cursor: 'pointer' }}
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </FormField>

          {/* Image URL */}
          <FormField label="URL Gambar (Opsional)">
            <input
              className="input"
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={form.imageUrl}
              onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
            />
          </FormField>

          {/* Status */}
          {isEdit && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                type="checkbox" id="isActive" checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                style={{ width: 16, height: 16, accentColor: 'var(--color-primary)', cursor: 'pointer' }}
              />
              <label htmlFor="isActive" style={{ fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
                Produk aktif
              </label>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" onClick={onClose} className="btn btn-ghost">Batal</button>
            <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
              {mutation.isPending ? 'Menyimpan...' : isEdit ? 'Simpan' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
