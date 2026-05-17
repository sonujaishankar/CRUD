import api from './client';

export interface Category {
  id: number;
  name: string;
  description?: string;
  products?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
}

export const categoriesApi = {
  getAll: () =>
    api.get<Category[]>('/categories').then(r => r.data),

  getOne: (id: number) =>
    api.get<Category>(`/categories/${id}`).then(r => r.data),

  create: (data: CreateCategoryData) =>
    api.post<Category>('/categories', data).then(r => r.data),

  update: (id: number, data: Partial<CreateCategoryData>) =>
    api.put<Category>(`/categories/${id}`, data).then(r => r.data),

  delete: (id: number) =>
    api.delete(`/categories/${id}`).then(r => r.data),
};
