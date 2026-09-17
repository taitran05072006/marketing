import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '../api/orderApi';
import { paymentApi } from '../api/paymentApi';
import type { OrderCreateRequest } from '../types/order.types';

export const orderKeys = {
  all: ['orders'] as const,
  list: (params: object) => [...orderKeys.all, 'list', params] as const,
  detail: (orderCode: string) => [...orderKeys.all, 'detail', orderCode] as const,
  adminAll: (params: object) => [...orderKeys.all, 'admin', params] as const,
};

export function useMyOrders(page = 0, size = 10) {
  return useQuery({
    queryKey: orderKeys.list({ page, size }),
    queryFn: () => orderApi.getMyOrders({ page, size }),
  });
}

export function useOrderDetail(orderCode: string) {
  return useQuery({
    queryKey: orderKeys.detail(orderCode),
    queryFn: () => orderApi.getOrderByCode(orderCode),
    enabled: Boolean(orderCode),
  });
}

export function usePlaceOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: OrderCreateRequest) => orderApi.placeOrder(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

export function useCreatePaymentLink() {
  return useMutation({
    mutationFn: ({ orderId, method }: { orderId: number; method?: 'PAYOS' | 'COD' }) => 
      paymentApi.createPaymentLink(orderId, method),
  });
}

export function useAdminOrders(page = 0, size = 10) {
  return useQuery({
    queryKey: orderKeys.adminAll({ page, size }),
    queryFn: () => orderApi.adminGetAll({ page, size }),
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orderCode, status }: { orderCode: string; status: string }) =>
      orderApi.adminUpdateStatus(orderCode, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: orderKeys.all }),
  });
}
