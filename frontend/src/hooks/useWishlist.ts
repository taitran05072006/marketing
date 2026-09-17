import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistApi } from '../api/wishlistApi';
import { useAuth } from '../context/AuthContext';

export const wishlistKeys = {
  all: ['wishlist'] as const,
  check: (productId: number) => ['wishlist', 'check', productId] as const,
};

export function useWishlist() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: wishlistKeys.all,
    queryFn: wishlistApi.getWishlist,
    enabled: isAuthenticated,
  });
}

export function useCheckWishlist(productId: number) {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: wishlistKeys.check(productId),
    queryFn: () => wishlistApi.checkInWishlist(productId),
    enabled: isAuthenticated && Boolean(productId),
  });
}

export function useToggleWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, inWishlist }: { productId: number; inWishlist: boolean }) => {
      if (inWishlist) {
        await wishlistApi.removeFromWishlist(productId);
      } else {
        await wishlistApi.addToWishlist(productId);
      }
      return !inWishlist;
    },
    onSuccess: (_result, { productId }) => {
      qc.invalidateQueries({ queryKey: wishlistKeys.all });
      qc.invalidateQueries({ queryKey: wishlistKeys.check(productId) });
    },
  });
}
