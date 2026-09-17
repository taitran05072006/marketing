import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewApi } from '../api/reviewApi';
import type { ReviewCreateRequest, ReviewUpdateRequest } from '../types/review.types';

export const reviewKeys = {
  product: (productId: number, page: number) => ['reviews', productId, page] as const,
};

export function useProductReviews(productId: number, page = 0, size = 10) {
  return useQuery({
    queryKey: reviewKeys.product(productId, page),
    queryFn: () => reviewApi.getProductReviews(productId, { page, size }),
    enabled: Boolean(productId),
  });
}

export function useAddReview(productId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ReviewCreateRequest) => reviewApi.addReview(productId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reviews', productId] }),
  });
}

export function useUpdateReview(productId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, data }: { reviewId: number; data: ReviewUpdateRequest }) =>
      reviewApi.updateReview(productId, reviewId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reviews', productId] }),
  });
}

export function useDeleteReview(productId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: number) => reviewApi.deleteReview(productId, reviewId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reviews', productId] }),
  });
}
