import apiClient from './apiClient';
import type { ProductCategoryResponse } from '../types/product.types';
import type { ArticleCategoryResponse } from '../types/article.types';

export const categoryApi = {
  // GET /api/product-categories
  getProductCategories: async (): Promise<ProductCategoryResponse[]> => {
    const res = await apiClient.get<ProductCategoryResponse[]>('/product-categories');
    return res.data;
  },

  // GET /api/product-categories/{slug}
  getProductCategoryBySlug: async (slug: string): Promise<ProductCategoryResponse> => {
    const res = await apiClient.get<ProductCategoryResponse>(`/product-categories/${slug}`);
    return res.data;
  },

  // GET /api/article-categories
  getArticleCategories: async (): Promise<ArticleCategoryResponse[]> => {
    const res = await apiClient.get<ArticleCategoryResponse[]>('/article-categories');
    return res.data;
  },

  // GET /api/article-categories/{slug}
  getArticleCategoryBySlug: async (slug: string): Promise<ArticleCategoryResponse> => {
    const res = await apiClient.get<ArticleCategoryResponse>(`/article-categories/${slug}`);
    return res.data;
  },

  // Admin product categories
  adminGetProductCategories: async (): Promise<ProductCategoryResponse[]> => {
    const res = await apiClient.get<ProductCategoryResponse[]>('/admin/product-categories');
    return res.data;
  },
  adminCreateProductCategory: async (data: { name: string; slug: string; description?: string }): Promise<ProductCategoryResponse> => {
    const res = await apiClient.post<ProductCategoryResponse>('/admin/product-categories', data);
    return res.data;
  },
  adminUpdateProductCategory: async (id: number, data: { name?: string; slug?: string; description?: string }): Promise<ProductCategoryResponse> => {
    const res = await apiClient.put<ProductCategoryResponse>(`/admin/product-categories/${id}`, data);
    return res.data;
  },
  adminDeleteProductCategory: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/product-categories/${id}`);
  },

  // Admin article categories
  adminGetArticleCategories: async (): Promise<ArticleCategoryResponse[]> => {
    const res = await apiClient.get<ArticleCategoryResponse[]>('/admin/article-categories');
    return res.data;
  },
  adminCreateArticleCategory: async (data: { name: string; slug: string; description?: string }): Promise<ArticleCategoryResponse> => {
    const res = await apiClient.post<ArticleCategoryResponse>('/admin/article-categories', data);
    return res.data;
  },
  adminUpdateArticleCategory: async (id: number, data: { name?: string; slug?: string; description?: string }): Promise<ArticleCategoryResponse> => {
    const res = await apiClient.put<ArticleCategoryResponse>(`/admin/article-categories/${id}`, data);
    return res.data;
  },
  adminDeleteArticleCategory: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/article-categories/${id}`);
  },
};
