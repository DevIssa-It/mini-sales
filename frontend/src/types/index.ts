export interface Product {
  id: string;
  name: string;
  price: string | number;
  stock: number;
  isActive: boolean;
  imageUrl?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface TransactionItem {
  id: string;
  productId: string;
  productName: string;
  priceAtTime: string | number;
  quantity: number;
  subtotal: string | number;
  product?: { id: string; name: string; isActive: boolean };
}

export interface Transaction {
  id: string;
  total: string | number;
  createdAt: string;
  items: TransactionItem[];
  _count?: { items: number };
}
