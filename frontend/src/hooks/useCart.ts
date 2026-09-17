import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '../api/cartApi';
import { useAuth } from '../context/AuthContext';
import type { CartItemRequest } from '../types/cart.types';

export const cartKeys = {
  all: ['cart'] as const,
};

export function useCart() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: cartKeys.all,
    queryFn: cartApi.getCart,
    enabled: isAuthenticated,
  });
}

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CartItemRequest) => cartApi.addItem(data),
    onSuccess: (newCart) => {
      qc.setQueryData(cartKeys.all, newCart);
    },
  });
}

export function useUpdateCartQuantity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      cartApi.updateQuantity(itemId, quantity),
    onSuccess: (newCart) => {
      qc.setQueryData(cartKeys.all, newCart);
    },
  });
}

export function useRemoveFromCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (itemId: number) => cartApi.removeItem(itemId),
    onSuccess: (newCart) => {
      qc.setQueryData(cartKeys.all, newCart);
    },
  });
}

export function useClearCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: () => {
      qc.setQueryData(cartKeys.all, { id: 0, items: [], totalAmount: 0 });
    },
  });
}
