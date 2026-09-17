// Common/shared types
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
export type ProductStatus = 'ACTIVE' | 'INACTIVE';
export type ArticleStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type ReviewStatus = 'PENDING' | 'PUBLISHED' | 'HIDDEN';
export type CommentStatus = 'PENDING' | 'PUBLISHED' | 'HIDDEN';
export type UserRole = 'CUSTOMER' | 'ADMIN';
