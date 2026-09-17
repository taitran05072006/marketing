import apiClient from './apiClient';
import type { PageResponse } from '../types/common.types';
import type { ReviewResponse, ReviewCreateRequest, ReviewUpdateRequest } from '../types/review.types';

export const reviewApi = {
  // GET /api/products/{productId}/reviews
  getProductReviews: async (productId: number, params: { page?: number; size?: number } = {}): Promise<PageResponse<ReviewResponse>> => {
    const res = await apiClient.get<PageResponse<ReviewResponse>>(`/products/${productId}/reviews`, { params });
    return res.data;
  },

  // POST /api/products/{productId}/reviews
  addReview: async (productId: number, data: ReviewCreateRequest): Promise<ReviewResponse> => {
    const res = await apiClient.post<ReviewResponse>(`/products/${productId}/reviews`, data);
    return res.data;
  },

  // PUT /api/products/{productId}/reviews/{reviewId}
  updateReview: async (productId: number, reviewId: number, data: ReviewUpdateRequest): Promise<ReviewResponse> => {
    const res = await apiClient.put<ReviewResponse>(`/products/${productId}/reviews/${reviewId}`, data);
    return res.data;
  },

  // DELETE /api/products/{productId}/reviews/{reviewId}
  deleteReview: async (productId: number, reviewId: number): Promise<void> => {
    await apiClient.delete(`/products/${productId}/reviews/${reviewId}`);
  },
};
