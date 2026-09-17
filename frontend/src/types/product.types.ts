import type { ProductStatus } from './common.types';

export interface ProductCategoryResponse {
  id: number;
  name: string;
  slug: string;
  description: string;
}

// Matches backend ProductResponse DTO
export interface ProductResponse {
  id: number;
  name: string;
  slug: string;
  price: number;
  primaryImageUrl: string;
  categoryName: string;
  status: ProductStatus;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

// Matches backend ProductDetailResponse DTO
export interface ProductDetailResponse {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  categoryName: string;
  status: ProductStatus;
  isFeatured: boolean;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

// Admin create/update
export interface ProductCreateRequest {
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: number;
  status?: string;
  isFeatured?: boolean;
  imageUrls?: string[];
}

export type ProductUpdateRequest = Partial<ProductCreateRequest>;
