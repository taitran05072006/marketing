import { useSearchParams, Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useArticles } from '../../hooks/useArticles';
import { ProductGrid } from '../../components/product/ProductGrid';
import { ArticleGrid } from '../../components/article/ArticleGrid';
import { EmptySearch } from '../../components/common/EmptyState';
import { ArrowRight } from 'lucide-react';

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { data: productsData, isLoading: loadingProducts } = useProducts({ keyword: query, size: 8 });
  const { data: articlesData, isLoading: loadingArticles } = useArticles({ keyword: query, size: 6 });

  const products = productsData?.content || [];
  const articles = articlesData?.content || [];

  const isLoading = loadingProducts || loadingArticles;
  const hasResults = products.length > 0 || articles.length > 0;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-pulse">
        <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-12"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="aspect-square bg-gray-200 rounded-2xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-3xl font-bold text-text-dark mb-3">
          Kết quả tìm kiếm cho "{query}"
        </h1>
        <p className="text-gray-500">
          Tìm thấy {productsData?.totalElements || 0} sản phẩm và {articlesData?.totalElements || 0} bài viết.
        </p>
      </div>

      {!hasResults ? (
        <EmptySearch />
      ) : (
        <div className="space-y-20">
          {products.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-text-dark">Sản phẩm ({productsData?.totalElements})</h2>
                {productsData && productsData.totalElements > 8 && (
                  <Link to={`/products?keyword=${encodeURIComponent(query)}`} className="text-primary font-medium hover:underline flex items-center gap-1">
                    Xem tất cả <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
              <ProductGrid products={products} />
            </div>
          )}

          {articles.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-text-dark">Bài viết ({articlesData?.totalElements})</h2>
                {articlesData && articlesData.totalElements > 6 && (
                  <Link to={`/articles?keyword=${encodeURIComponent(query)}`} className="text-primary font-medium hover:underline flex items-center gap-1">
                    Xem tất cả <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
              <ArticleGrid articles={articles} columns={3} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
