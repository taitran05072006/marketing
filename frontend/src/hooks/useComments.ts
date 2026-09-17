import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentApi } from '../api/commentApi';
import type { CommentCreateRequest, CommentUpdateRequest } from '../types/comment.types';

export const commentKeys = {
  article: (articleId: number, page: number) => ['comments', articleId, page] as const,
};

export function useArticleComments(articleId: number, page = 0, size = 10) {
  return useQuery({
    queryKey: commentKeys.article(articleId, page),
    queryFn: () => commentApi.getArticleComments(articleId, { page, size }),
    enabled: Boolean(articleId),
  });
}

export function useAddComment(articleId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CommentCreateRequest) => commentApi.addComment(articleId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['comments', articleId] }),
  });
}

export function useUpdateComment(articleId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, data }: { commentId: number; data: CommentUpdateRequest }) =>
      commentApi.updateComment(articleId, commentId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['comments', articleId] }),
  });
}

export function useDeleteComment(articleId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (commentId: number) => commentApi.deleteComment(articleId, commentId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['comments', articleId] }),
  });
}
