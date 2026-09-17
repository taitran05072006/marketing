import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '../api/categoryApi';

export const categoryKeys = {
  productCategories: ['product-categories'] as const,
  articleCategories: ['article-categories'] as const,
};

export function useProductCategories() {
  return useQuery({
    queryKey: categoryKeys.productCategories,
    queryFn: categoryApi.getProductCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes - categories change rarely
  });
}

export function useArticleCategories() {
  return useQuery({
    queryKey: categoryKeys.articleCategories,
    queryFn: categoryApi.getArticleCategories,
    staleTime: 5 * 60 * 1000,
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateProductCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoryApi.adminCreateProductCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.productCategories });
    },
  });
}

export function useUpdateProductCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof categoryApi.adminUpdateProductCategory>[1] }) =>
      categoryApi.adminUpdateProductCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.productCategories });
    },
  });
}

export function useDeleteProductCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoryApi.adminDeleteProductCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.productCategories });
    },
  });
}

export function useCreateArticleCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoryApi.adminCreateArticleCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.articleCategories });
    },
  });
}

export function useUpdateArticleCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof categoryApi.adminUpdateArticleCategory>[1] }) =>
      categoryApi.adminUpdateArticleCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.articleCategories });
    },
  });
}

export function useDeleteArticleCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoryApi.adminDeleteArticleCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.articleCategories });
    },
  });
}
