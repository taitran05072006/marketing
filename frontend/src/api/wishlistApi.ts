import apiClient from './apiClient';
import type { ProductResponse } from '../types/product.types';

export const wishlistApi = {
  // GET /api/wishlists
  getWishlist: async (): Promise<ProductResponse[]> => {
    const res = await apiClient.get<ProductResponse[]>('/wishlists');
    return res.data;
  },

  // POST /api/wishlists/{productId}
  addToWishlist: async (productId: number): Promise<void> => {
    await apiClient.post(`/wishlists/${productId}`);
  },

  // DELETE /api/wishlists/{productId}
  removeFromWishlist: async (productId: number): Promise<void> => {
    await apiClient.delete(`/wishlists/${productId}`);
  },

  // GET /api/wishlists/{productId}/check
  checkInWishlist: async (productId: number): Promise<boolean> => {
    const res = await apiClient.get<{ inWishlist: boolean }>(`/wishlists/${productId}/check`);
    return res.data.inWishlist;
  },
};
