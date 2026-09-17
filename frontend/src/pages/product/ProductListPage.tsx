import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts, useProductsByCategory } from '../../hooks/useProducts';
import { useProductCategories } from '../../hooks/useCategories';
import { ProductGrid } from '../../components/product/ProductGrid';
import { Pagination } from '../../components/common/Pagination';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyProducts } from '../../components/common/EmptyState';
import { Search } from 'lucide-react';

export function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keywordParam = searchParams.get('keyword') || '';
  const categoryParam = searchParams.get('category') || '';
  const pageParam = parseInt(searchParams.get('page') || '0', 10);

  const [searchInput, setSearchInput] = useState(keywordParam);

  const { data: categories } = useProductCategories();

  // If a category is selected, we use the specific category endpoint
  // Otherwise we use the general products endpoint
  const queryHook = categoryParam
    ? useProductsByCategory(categoryParam, pageParam, 12)
    : useProducts({ page: pageParam, size: 12, keyword: keywordParam || undefined });

  const { data, isLoading, isError, refetch } = queryHook;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ keyword: searchInput.trim() });
    } else {
      searchParams.delete('keyword');
      setSearchParams(searchParams);
    }
  };

  const setCategory = (slug: string) => {
    if (slug) {
      setSearchParams({ category: slug });
    } else {
      searchParams.delete('category');
      setSearchParams(searchParams);
    }
    setSearchInput(''); // clear search when changing category
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">
            {categoryParam
              ? categories?.find(c => c.slug === categoryParam)?.name || 'Sản phẩm'
              : 'Tất cả sản phẩm'}
          </h1>
          <p className="text-gray-500">
            {keywordParam ? `Kết quả tìm kiếm cho "${keywordParam}"` : 'Giải pháp chăm sóc da chuyên biệt, an toàn và hiệu quả.'}
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative w-full md:w-72">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </form>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-8">
          <div>
            <h3 className="font-semibold text-text-dark mb-4 uppercase tracking-wider text-sm">Danh mục</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setCategory('')}
                  className={`text-sm w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    !categoryParam ? 'bg-primary text-white font-medium' : 'text-gray-600 hover:bg-surface hover:text-primary'
                  }`}
                >
                  Tất cả sản phẩm
                </button>
              </li>
              {categories?.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => setCategory(cat.slug)}
                    className={`text-sm w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      categoryParam === cat.slug ? 'bg-primary text-white font-medium' : 'text-gray-600 hover:bg-surface hover:text-primary'
                    }`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {isError ? (
            <ErrorState onRetry={refetch} />
          ) : !isLoading && data?.content?.length === 0 ? (
            <EmptyProducts />
          ) : (
            <>
              <ProductGrid products={data?.content} loading={isLoading} skeletonCount={12} />
              
              {data && data.totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <Pagination
                    page={pageParam}
                    totalPages={data.totalPages}
                    onPageChange={(p) => {
                      searchParams.set('page', p.toString());
                      setSearchParams(searchParams);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
