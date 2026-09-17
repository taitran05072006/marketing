import type { OrderStatus } from './common.types';

// Matches backend OrderItemResponse DTO
export interface OrderItemResponse {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

// Matches backend OrderResponse DTO
export interface OrderResponse {
  id: number;
  orderCode: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
}

// Matches backend OrderDetailResponse DTO
export interface OrderDetailResponse {
  id: number;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItemResponse[];
  createdAt: string;
}

// Matches backend OrderCreateRequest DTO
export interface OrderCreateRequest {
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
}
