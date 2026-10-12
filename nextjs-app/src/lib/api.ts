const API_BASE = typeof window === 'undefined'
  ? (process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080')
  : (process.env.NEXT_PUBLIC_API_URL || '');

export async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    if (res.status === 404) throw new NotFoundError(`Not found: ${path}`);
    throw new Error(`API error ${res.status}: ${path}`);
  }

  return res.json();
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

// Revalidation times
export const REVALIDATE = {
  ARTICLE_LIST: 300,   // 5 min
  ARTICLE_DETAIL: 600, // 10 min
  PRODUCT_LIST: 300,   // 5 min
  PRODUCT_DETAIL: 600, // 10 min
  HOME: 300,           // 5 min
  SITEMAP: 3600,       // 1 hour
};
