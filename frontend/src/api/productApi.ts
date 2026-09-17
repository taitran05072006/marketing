import apiClient from './apiClient';
import type { PageResponse } from '../types/common.types';
import type { ProductResponse, ProductDetailResponse, ProductCreateRequest, ProductUpdateRequest } from '../types/product.types';

export interface GetProductsParams {
  page?: number;
  size?: number;
  keyword?: string;
  categorySlug?: string;
}

export const productApi = {
  // GET /api/products
  getProducts: async (params: GetProductsParams = {}): Promise<PageResponse<ProductResponse>> => {
    const res = await apiClient.get<PageResponse<ProductResponse>>('/products', { params });
    return res.data;
  },

  // GET /api/products/{slug}
  getProductBySlug: async (slug: string): Promise<ProductDetailResponse> => {
    const res = await apiClient.get<ProductDetailResponse>(`/products/${slug}`);
    return res.data;
  },

  // GET /api/products/category/{slug}
  getProductsByCategory: async (slug: string, params: { page?: number; size?: number } = {}): Promise<PageResponse<ProductResponse>> => {
    const res = await apiClient.get<PageResponse<ProductResponse>>(`/products/category/${slug}`, { params });
    return res.data;
  },

  // Admin endpoints
  // GET /api/admin/products
  adminGetAll: async (params: { page?: number; size?: number } = {}): Promise<PageResponse<ProductDetailResponse>> => {
    const res = await apiClient.get<PageResponse<ProductDetailResponse>>('/admin/products', { params });
    return res.data;
  },

  // GET /api/admin/products/{id}
  adminGetById: async (id: number): Promise<ProductDetailResponse> => {
    const res = await apiClient.get<ProductDetailResponse>(`/admin/products/${id}`);
    return res.data;
  },

  // POST /api/admin/products
  adminCreate: async (data: ProductCreateRequest): Promise<ProductDetailResponse> => {
    const res = await apiClient.post<ProductDetailResponse>('/admin/products', data);
    return res.data;
  },

  // PUT /api/admin/products/{id}
  adminUpdate: async (id: number, data: ProductUpdateRequest): Promise<ProductDetailResponse> => {
    const res = await apiClient.put<ProductDetailResponse>(`/admin/products/${id}`, data);
    return res.data;
  },

  // DELETE /api/admin/products/{id}
  adminDelete: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/products/${id}`);
  },
};
