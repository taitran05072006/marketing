import apiClient from './apiClient';
import type { PageResponse } from '../types/common.types';
import type { OrderResponse, OrderDetailResponse, OrderCreateRequest } from '../types/order.types';

export const orderApi = {
  // POST /api/orders
  placeOrder: async (data: OrderCreateRequest): Promise<OrderDetailResponse> => {
    const res = await apiClient.post<OrderDetailResponse>('/orders', data);
    return res.data;
  },

  // GET /api/orders
  getMyOrders: async (params: { page?: number; size?: number } = {}): Promise<PageResponse<OrderResponse>> => {
    const res = await apiClient.get<PageResponse<OrderResponse>>('/orders', { params });
    return res.data;
  },

  // GET /api/orders/{orderCode}
  getOrderByCode: async (orderCode: string): Promise<OrderDetailResponse> => {
    const res = await apiClient.get<OrderDetailResponse>(`/orders/${orderCode}`);
    return res.data;
  },

  // Admin: GET /api/admin/orders
  adminGetAll: async (params: { page?: number; size?: number } = {}): Promise<PageResponse<OrderDetailResponse>> => {
    const res = await apiClient.get<PageResponse<OrderDetailResponse>>('/admin/orders', { params });
    return res.data;
  },

  // Admin: PUT /api/admin/orders/{orderCode}/status?status=...
  adminUpdateStatus: async (orderCode: string, status: string): Promise<OrderDetailResponse> => {
    const res = await apiClient.put<OrderDetailResponse>(`/admin/orders/${orderCode}/status`, null, {
      params: { status },
    });
    return res.data;
  },
};
