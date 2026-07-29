import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '../types';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantityToAdd?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  totalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, quantityToAdd: number = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          const currentQty = existing ? existing.quantity : 0;
          const targetQty = Math.min(currentQty + quantityToAdd, product.stock);

          if (product.stock === 0) return state;

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id ? { ...i, quantity: targetQty } : i,
              ),
            };
          }
          return { items: [...state.items, { product, quantity: targetQty }] };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        set((state) => {
          const item = state.items.find((i) => i.product.id === productId);
          if (!item) return state;

          if (quantity <= 0) {
            return { items: state.items.filter((i) => i.product.id !== productId) };
          }

          const clamped = Math.min(quantity, item.product.stock);
          return {
            items: state.items.map((i) =>
              i.product.id === productId ? { ...i, quantity: clamped } : i,
            ),
          };
        });
      },

      clearCart: () => set({ items: [] }),

      total: () => {
        return get().items.reduce(
          (acc, item) => acc + Number(item.product.price) * item.quantity,
          0,
        );
      },

      totalItems: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },
    }),
    {
      name: 'mini-pos-cart',
    },
  ),
);
