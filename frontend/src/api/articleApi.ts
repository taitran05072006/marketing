import apiClient from './apiClient';
import type { PageResponse } from '../types/common.types';
import type { ArticleResponse, ArticleDetailResponse, ArticleCreateRequest, ArticleUpdateRequest } from '../types/article.types';

export interface GetArticlesParams {
  page?: number;
  size?: number;
  keyword?: string;
  categorySlug?: string;
}

export const articleApi = {
  // GET /api/articles
  getArticles: async (params: GetArticlesParams = {}): Promise<PageResponse<ArticleResponse>> => {
    const res = await apiClient.get<PageResponse<ArticleResponse>>('/articles', { params });
    return res.data;
  },

  // GET /api/articles/{slug}
  getArticleBySlug: async (slug: string): Promise<ArticleDetailResponse> => {
    const res = await apiClient.get<ArticleDetailResponse>(`/articles/${slug}`);
    return res.data;
  },

  // GET /api/articles/category/{slug}
  getArticlesByCategory: async (slug: string, params: { page?: number; size?: number } = {}): Promise<PageResponse<ArticleResponse>> => {
    const res = await apiClient.get<PageResponse<ArticleResponse>>(`/articles/category/${slug}`, { params });
    return res.data;
  },

  // Admin endpoints
  // GET /api/admin/articles
  adminGetAll: async (params: { page?: number; size?: number } = {}): Promise<PageResponse<ArticleDetailResponse>> => {
    const res = await apiClient.get<PageResponse<ArticleDetailResponse>>('/admin/articles', { params });
    return res.data;
  },

  // GET /api/admin/articles/{id}
  adminGetById: async (id: number): Promise<ArticleDetailResponse> => {
    const res = await apiClient.get<ArticleDetailResponse>(`/admin/articles/${id}`);
    return res.data;
  },

  // POST /api/admin/articles
  adminCreate: async (data: ArticleCreateRequest): Promise<ArticleDetailResponse> => {
    const res = await apiClient.post<ArticleDetailResponse>('/admin/articles', data);
    return res.data;
  },

  // PUT /api/admin/articles/{id}
  adminUpdate: async (id: number, data: ArticleUpdateRequest): Promise<ArticleDetailResponse> => {
    const res = await apiClient.put<ArticleDetailResponse>(`/admin/articles/${id}`, data);
    return res.data;
  },

  // DELETE /api/admin/articles/{id}
  adminDelete: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/articles/${id}`);
  },

  // PATCH /api/admin/articles/{id}/publish
  adminPublish: async (id: number): Promise<void> => {
    await apiClient.patch(`/admin/articles/${id}/publish`);
  },

  // PATCH /api/admin/articles/{id}/draft
  adminDraft: async (id: number): Promise<void> => {
    await apiClient.patch(`/admin/articles/${id}/draft`);
  },
};
