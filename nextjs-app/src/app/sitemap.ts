import { MetadataRoute } from 'next';
import { fetchApi, REVALIDATE } from '@/lib/api';
import { SitemapEntry } from '@/types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const revalidate = REVALIDATE.SITEMAP;

// Thoi gian cap nhat co dinh cho cac trang chinh sach tinh (cap nhat khi noi dung chinh sach thay doi)
const STATIC_LAST_MOD = new Date('2024-10-01T00:00:00.000Z');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: STATIC_LAST_MOD, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/products`, lastModified: STATIC_LAST_MOD, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/articles`, lastModified: STATIC_LAST_MOD, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: STATIC_LAST_MOD, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: STATIC_LAST_MOD, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/privacy-policy`, lastModified: STATIC_LAST_MOD, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/terms`, lastModified: STATIC_LAST_MOD, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/return-policy`, lastModified: STATIC_LAST_MOD, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/shipping-policy`, lastModified: STATIC_LAST_MOD, changeFrequency: 'monthly', priority: 0.4 },
  ];

  let dynamicPages: MetadataRoute.Sitemap = [];

  try {
    const entries = await fetchApi<SitemapEntry[]>('/sitemap/entries');

    dynamicPages = entries
      .filter((entry) => entry.slug && entry.slug.trim().length > 0)
      .map((entry) => {
        const pathMap: Record<string, string> = {
          article: 'articles',
          product: 'products',
          'article-category': 'articles/category',
          'product-category': 'products/category',
        };

        const path = pathMap[entry.entityType] || entry.entityType;
        const lastMod = entry.lastmod ? new Date(entry.lastmod) : STATIC_LAST_MOD;

        return {
          url: `${SITE_URL}/${path}/${entry.slug}`,
          lastModified: lastMod,
          changeFrequency: entry.entityType.includes('category') ? 'weekly' : 'daily',
          priority: entry.entityType === 'article' || entry.entityType === 'product' ? 0.8 : 0.6,
        };
      });
  } catch (e) {
    console.error('[SITEMAP_FETCH_ERROR] Khong the tai danh sach entries tu Backend API /api/sitemap/entries:', e);
  }

  return [...staticPages, ...dynamicPages];
}
