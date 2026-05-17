import api from './client';

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: string;
  quantity: number;
  sku?: string;
  categoryId?: number;
  category?: { id: number; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface ProductStats {
  totalProducts: number;
  totalValue: number;
  lowStock: number;
  outOfStock: number;
}

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  sku?: string;
  categoryId?: number;
}

export const productsApi = {
  getAll: (search?: string) =>
    api.get<Product[]>('/products', { params: search ? { search } : {} }).then(r => r.data),

  getOne: (id: number) =>
    api.get<Product>(`/products/${id}`).then(r => r.data),

  getStats: () =>
    api.get<ProductStats>('/products/stats').then(r => r.data),

  create: (data: CreateProductData) =>
    api.post<Product>('/products', data).then(r => r.data),

  update: (id: number, data: Partial<CreateProductData>) =>
    api.put<Product>(`/products/${id}`, data).then(r => r.data),

  delete: (id: number) =>
    api.delete(`/products/${id}`).then(r => r.data),
};
