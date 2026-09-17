import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi, type GetProductsParams } from '../api/productApi';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: GetProductsParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (slug: string) => [...productKeys.details(), slug] as const,
  byCategory: (slug: string, page: number, size: number) => [...productKeys.all, 'category', slug, page, size] as const,
  adminAll: (params: object) => [...productKeys.all, 'admin', params] as const,
  adminDetail: (id: number) => [...productKeys.all, 'admin', 'detail', id] as const,
};

export function useProducts(params: GetProductsParams = {}) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productApi.getProducts(params),
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: () => productApi.getProductBySlug(slug),
    enabled: Boolean(slug),
  });
}

export function useProductsByCategory(slug: string, page = 0, size = 10) {
  return useQuery({
    queryKey: productKeys.byCategory(slug, page, size),
    queryFn: () => productApi.getProductsByCategory(slug, { page, size }),
    enabled: Boolean(slug),
  });
}

export function useAdminProducts(params: { page?: number; size?: number } = {}) {
  return useQuery({
    queryKey: productKeys.adminAll(params),
    queryFn: () => productApi.adminGetAll(params),
  });
}

export function useAdminProduct(id: number) {
  return useQuery({
    queryKey: productKeys.adminDetail(id),
    queryFn: () => productApi.adminGetById(id),
    enabled: Boolean(id),
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productApi.adminCreate,
    onSuccess: () => qc.invalidateQueries({ queryKey: productKeys.all }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof productApi.adminUpdate>[1] }) =>
      productApi.adminUpdate(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: productKeys.all }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productApi.adminDelete,
    onSuccess: () => qc.invalidateQueries({ queryKey: productKeys.all }),
  });
}
