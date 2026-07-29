import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Package } from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import { getProducts, toggleProductStatus } from '../lib/api';
import { useCartStore } from '../store/cartStore';
import { ProductForm } from '../components/products/ProductForm';
import { ProductTableRow } from '../components/products/ProductTableRow';
import { TableSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { PageContainer } from '../components/layout/PageContainer';
import type { Product } from '../types';

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);

  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => getProducts(),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => toggleProductStatus(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(`Produk "${data.name}" ${data.isActive ? 'diaktifkan' : 'dinonaktifkan'}`);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // Unique categories list
  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category || 'Lainnya').filter(Boolean)))];

  const filtered = products.filter((p) => {
    const matchStatus =
      statusFilter === 'all' ? true :
      statusFilter === 'active' ? p.isActive :
      !p.isActive;
    const matchCategory =
      categoryFilter === 'all' ? true :
      (p.category || 'Lainnya') === categoryFilter;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());

    return matchStatus && matchCategory && matchSearch;
  });

  const openAdd = () => { setEditProduct(null); setShowForm(true); };

  return (
    <PageContainer
      title="Manajemen Produk"
      subtitle={`${products.length} produk terdaftar`}
      action={
        <button onClick={openAdd} className="btn btn-primary" id="btn-add-product">
          <Plus size={16} weight="bold" /> Tambah Produk
        </button>
      }
    >
      {/* Search, Status & Category Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          className="input"
          placeholder="Cari nama produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 260 }}
          id="input-search-product"
        />

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 500 }}>Kategori:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`btn btn-sm ${categoryFilter === cat ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: 99 }}
            >
              {cat === 'all' ? 'Semua' : cat}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
          {(['all', 'active', 'inactive'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`btn btn-sm ${statusFilter === f ? 'btn-outline' : 'btn-ghost'}`}
            >
              {f === 'all' ? 'Semua Status' : f === 'active' ? 'Aktif' : 'Nonaktif'}
            </button>
          ))}
        </div>
      </div>

      {/* Table content */}
      {isLoading ? (
        <TableSkeleton rows={6} />
      ) : error ? (
        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
          <p style={{ color: 'var(--color-danger)', fontSize: 14 }}>Gagal memuat produk.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<Package size={28} />}
            title={search || categoryFilter !== 'all' ? 'Produk tidak ditemukan' : 'Belum ada produk'}
            description={search || categoryFilter !== 'all' ? `Tidak ada produk dengan kriteria filter saat ini.` : 'Mulai dengan menambahkan produk pertama Anda.'}
            action={!search && categoryFilter === 'all' ? <button onClick={openAdd} className="btn btn-primary btn-sm"><Plus size={14} weight="bold" /> Tambah Produk</button> : undefined}
          />
        </div>
      ) : (
        <div className="card">
          <table className="table-base">
            <thead>
              <tr>
                <th>Nama Produk</th>
                <th>Harga</th>
                <th>Stok</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => {
                const cartItem = cartItems.find((i) => i.product.id === product.id);
                const cartQuantity = cartItem ? cartItem.quantity : 0;

                return (
                  <ProductTableRow
                    key={product.id}
                    product={product}
                    cartQuantity={cartQuantity}
                    onAddToCart={(p, qty) => {
                      addItem(p, qty);
                      toast.success(`${qty}x ${p.name} ditambahkan ke keranjang`);
                    }}
                    onEdit={(p) => { setEditProduct(p); setShowForm(true); }}
                    onToggleStatus={(id) => toggleMutation.mutate(id)}
                    isTogglePending={toggleMutation.isPending}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <ProductForm
          product={editProduct}
          onClose={() => { setShowForm(false); setEditProduct(null); }}
        />
      )}
    </PageContainer>
  );
}
