import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { articleApi, type GetArticlesParams } from '../api/articleApi';

export const articleKeys = {
  all: ['articles'] as const,
  lists: () => [...articleKeys.all, 'list'] as const,
  list: (params: GetArticlesParams) => [...articleKeys.lists(), params] as const,
  details: () => [...articleKeys.all, 'detail'] as const,
  detail: (slug: string) => [...articleKeys.details(), slug] as const,
  byCategory: (slug: string, page: number) => [...articleKeys.all, 'category', slug, page] as const,
  adminAll: (params: object) => [...articleKeys.all, 'admin', params] as const,
  adminDetail: (id: number) => [...articleKeys.all, 'admin', 'detail', id] as const,
};

export function useArticles(params: GetArticlesParams = {}) {
  return useQuery({
    queryKey: articleKeys.list(params),
    queryFn: () => articleApi.getArticles(params),
  });
}

export function useArticle(slug: string) {
  return useQuery({
    queryKey: articleKeys.detail(slug),
    queryFn: () => articleApi.getArticleBySlug(slug),
    enabled: Boolean(slug),
  });
}

export function useArticlesByCategory(slug: string, page = 0) {
  return useQuery({
    queryKey: articleKeys.byCategory(slug, page),
    queryFn: () => articleApi.getArticlesByCategory(slug, { page }),
    enabled: Boolean(slug),
  });
}

export function useAdminArticles(params: { page?: number; size?: number } = {}) {
  return useQuery({
    queryKey: articleKeys.adminAll(params),
    queryFn: () => articleApi.adminGetAll(params),
  });
}

export function useAdminArticle(id: number) {
  return useQuery({
    queryKey: articleKeys.adminDetail(id),
    queryFn: () => articleApi.adminGetById(id),
    enabled: Boolean(id),
  });
}

export function useCreateArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: articleApi.adminCreate,
    onSuccess: () => qc.invalidateQueries({ queryKey: articleKeys.all }),
  });
}

export function useUpdateArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof articleApi.adminUpdate>[1] }) =>
      articleApi.adminUpdate(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: articleKeys.all }),
  });
}

export function useDeleteArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: articleApi.adminDelete,
    onSuccess: () => qc.invalidateQueries({ queryKey: articleKeys.all }),
  });
}

export function usePublishArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: articleApi.adminPublish,
    onSuccess: () => qc.invalidateQueries({ queryKey: articleKeys.all }),
  });
}
