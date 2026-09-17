import type { ArticleStatus } from './common.types';
import type { ProductResponse } from './product.types';

export interface ArticleCategoryResponse {
  id: number;
  name: string;
  slug: string;
  description: string;
}

// Matches backend ArticleResponse DTO
export interface ArticleResponse {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  thumbnailUrl: string;
  thumbnailAlt: string;
  categoryName: string;
  authorName: string;
  status: ArticleStatus;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

// Matches backend ArticleDetailResponse DTO (extends ArticleResponse + relatedProducts)
export interface ArticleDetailResponse extends ArticleResponse {
  content: string;
  relatedProducts: ProductResponse[];
}

// Admin create/update
export interface ArticleCreateRequest {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  thumbnailUrl?: string;
  thumbnailAlt?: string;
  categoryId: number;
  productIds?: number[];
  status?: string;
}

export type ArticleUpdateRequest = Partial<ArticleCreateRequest>;
