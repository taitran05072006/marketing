import apiClient from './apiClient';
import type { CartResponse, CartItemRequest } from '../types/cart.types';

export const cartApi = {
  // GET /api/cart
  getCart: async (): Promise<CartResponse> => {
    const res = await apiClient.get<CartResponse>('/cart');
    return res.data;
  },

  // POST /api/cart/items
  addItem: async (data: CartItemRequest): Promise<CartResponse> => {
    const res = await apiClient.post<CartResponse>('/cart/items', data);
    return res.data;
  },

  // PUT /api/cart/items/{itemId}?quantity=...
  updateQuantity: async (itemId: number, quantity: number): Promise<CartResponse> => {
    const res = await apiClient.put<CartResponse>(`/cart/items/${itemId}`, null, {
      params: { quantity },
    });
    return res.data;
  },

  // DELETE /api/cart/items/{itemId}
  removeItem: async (itemId: number): Promise<CartResponse> => {
    const res = await apiClient.delete<CartResponse>(`/cart/items/${itemId}`);
    return res.data;
  },

  // DELETE /api/cart
  clearCart: async (): Promise<void> => {
    await apiClient.delete('/cart');
  },
};
