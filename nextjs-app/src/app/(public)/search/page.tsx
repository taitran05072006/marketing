'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Search as SearchIcon } from 'lucide-react';
import apiClient from '@/api/apiClient';
import type { ProductResponse, ArticleResponse, PageResponse } from '@/types';
import { formatCurrency } from '@/utils/formatCurrency';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || searchParams.get('keyword') || '';

  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [articles, setArticles] = useState<ArticleResponse[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalArticles, setTotalArticles] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      setArticles([]);
      setTotalProducts(0);
      setTotalArticles(0);
      return;
    }

    setLoading(true);
    Promise.all([
      apiClient.get<PageResponse<ProductResponse>>(`/products?keyword=${encodeURIComponent(query)}&size=8`),
      apiClient.get<PageResponse<ArticleResponse>>(`/articles?keyword=${encodeURIComponent(query)}&size=6`),
    ])
      .then(([prodRes, artRes]) => {
        setProducts(prodRes.data.content || []);
        setTotalProducts(prodRes.data.totalElements || 0);
        setArticles(artRes.data.content || []);
        setTotalArticles(artRes.data.totalElements || 0);
      })
      .catch((err) => {
        console.error('Search error:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-3xl font-serif font-bold text-text-dark mb-3">
          {query ? `Kết quả tìm kiếm cho "${query}"` : 'Tìm kiếm sản phẩm & bài viết'}
        </h1>
        {query && (
          <p className="text-gray-500">
            Tìm thấy {totalProducts} sản phẩm và {totalArticles} bài viết phù hợp.
          </p>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-2xl"></div>
          ))}
        </div>
      ) : !query ? (
        <div className="text-center py-20 text-gray-400">
          <SearchIcon className="w-12 h-12 mx-auto mb-4 stroke-1" />
          <p>Nhập từ khóa vào ô tìm kiếm để bắt đầu tra cứu.</p>
        </div>
      ) : products.length === 0 && articles.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">Không tìm thấy kết quả nào phù hợp với từ khóa "{query}".</p>
          <p className="text-sm text-gray-400 mt-2">Vui lòng thử lại với từ khóa khác.</p>
        </div>
      ) : (
        <div className="space-y-16">
          {products.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-serif font-bold text-text-dark">
                  Sản phẩm ({totalProducts})
                </h2>
                {totalProducts > 8 && (
                  <Link
                    href={`/products?keyword=${encodeURIComponent(query)}`}
                    className="text-primary font-medium hover:underline flex items-center gap-1 text-sm"
                  >
                    Xem tất cả <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((p) => (
                  <Link key={p.id} href={`/products/${p.slug}`} className="group">
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface mb-3">
                      {p.primaryImageUrl ? (
                        <Image
                          src={p.primaryImageUrl}
                          alt={p.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">💊</div>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mb-1">{p.categoryName}</div>
                    <h3 className="font-medium text-text-dark group-hover:text-primary transition-colors line-clamp-2 text-sm">
                      {p.name}
                    </h3>
                    <p className="text-primary font-semibold mt-1 text-sm">
                      {formatCurrency(p.price)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {articles.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-serif font-bold text-text-dark">
                  Bài viết ({totalArticles})
                </h2>
                {totalArticles > 6 && (
                  <Link
                    href={`/articles?keyword=${encodeURIComponent(query)}`}
                    className="text-primary font-medium hover:underline flex items-center gap-1 text-sm"
                  >
                    Xem tất cả <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {articles.map((a) => (
                  <Link key={a.id} href={`/articles/${a.slug}`} className="group">
                    {a.thumbnailUrl && (
                      <div className="relative aspect-video rounded-2xl overflow-hidden mb-3 bg-surface">
                        <Image
                          src={a.thumbnailUrl}
                          alt={a.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <h3 className="font-semibold text-text-dark group-hover:text-primary transition-colors line-clamp-2 text-base">
                      {a.title}
                    </h3>
                    {a.excerpt && (
                      <p className="text-gray-500 text-xs mt-1.5 line-clamp-2">{a.excerpt}</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
