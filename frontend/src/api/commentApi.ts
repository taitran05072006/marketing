import apiClient from './apiClient';
import type { PageResponse } from '../types/common.types';
import type { CommentResponse, CommentCreateRequest, CommentUpdateRequest } from '../types/comment.types';

export const commentApi = {
  // GET /api/articles/{articleId}/comments
  getArticleComments: async (articleId: number, params: { page?: number; size?: number } = {}): Promise<PageResponse<CommentResponse>> => {
    const res = await apiClient.get<PageResponse<CommentResponse>>(`/articles/${articleId}/comments`, { params });
    return res.data;
  },

  // POST /api/articles/{articleId}/comments
  addComment: async (articleId: number, data: CommentCreateRequest): Promise<CommentResponse> => {
    const res = await apiClient.post<CommentResponse>(`/articles/${articleId}/comments`, data);
    return res.data;
  },

  // PUT /api/articles/{articleId}/comments/{commentId}
  updateComment: async (articleId: number, commentId: number, data: CommentUpdateRequest): Promise<CommentResponse> => {
    const res = await apiClient.put<CommentResponse>(`/articles/${articleId}/comments/${commentId}`, data);
    return res.data;
  },

  // DELETE /api/articles/{articleId}/comments/{commentId}
  deleteComment: async (articleId: number, commentId: number): Promise<void> => {
    await apiClient.delete(`/articles/${articleId}/comments/${commentId}`);
  },
};
