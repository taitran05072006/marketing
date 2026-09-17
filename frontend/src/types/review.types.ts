import type { ReviewStatus } from './common.types';

// Matches backend ReviewResponse DTO
export interface ReviewResponse {
  id: number;
  productId: number;
  userName: string;
  rating: number;
  content: string;
  status: ReviewStatus;
  createdAt: string;
}

// Matches backend ReviewCreateRequest DTO
export interface ReviewCreateRequest {
  productId: number;
  orderItemId: number;
  rating: number;
  content: string;
}

// Matches backend ReviewUpdateRequest DTO
export interface ReviewUpdateRequest {
  rating?: number;
  content?: string;
}
