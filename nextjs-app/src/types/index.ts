export interface ArticleResponse {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  thumbnailUrl?: string;
  thumbnailAlt?: string;
  categoryName: string;
  categorySlug?: string;
  authorName: string;
  status: string;
  metaTitle?: string;
  metaDescription?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleDetailResponse extends ArticleResponse {
  content: string;
  ogImage?: string;
  canonicalUrl?: string;
  relatedProducts?: ProductResponse[];
}

export interface ProductResponse {
  id: number;
  name: string;
  slug: string;
  price: number;
  primaryImageUrl?: string;
  categoryName: string;
  categorySlug?: string;
  status: string;
  isFeatured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductDetailResponse extends ProductResponse {
  description?: string;
  stock: number;
  ogImage?: string;
  imageUrls?: string[];
}

export interface ProductCategoryResponse {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  updatedAt: string;
}

export interface ArticleCategoryResponse {
  id: number;
  name: string;
  slug: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  updatedAt: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface SitemapEntry {
  slug: string;
  lastmod: string;
  entityType: 'article' | 'product' | 'article-category' | 'product-category';
}
