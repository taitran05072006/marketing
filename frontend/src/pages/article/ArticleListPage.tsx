import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useArticles, useArticlesByCategory } from '../../hooks/useArticles';
import { useArticleCategories } from '../../hooks/useCategories';
import { ArticleGrid } from '../../components/article/ArticleGrid';
import { Pagination } from '../../components/common/Pagination';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyArticles } from '../../components/common/EmptyState';
import { Search } from 'lucide-react';

export function ArticleListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keywordParam = searchParams.get('keyword') || '';
  const categoryParam = searchParams.get('category') || '';
  const pageParam = parseInt(searchParams.get('page') || '0', 10);

  const [searchInput, setSearchInput] = useState(keywordParam);

  const { data: categories } = useArticleCategories();

  const queryHook = categoryParam
    ? useArticlesByCategory(categoryParam, pageParam)
    : useArticles({ page: pageParam, size: 9, keyword: keywordParam || undefined });

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
    setSearchInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12 max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold text-primary mb-6 leading-tight">
          Kiến thức chăm sóc da chuyên sâu
        </h1>
        <p className="text-gray-500 text-lg">
          Những bài viết được biên soạn bởi chuyên gia giúp bạn thấu hiểu và chăm sóc làn da khoa học hơn.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => setCategory('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !categoryParam ? 'bg-primary text-white' : 'bg-surface text-gray-600 hover:bg-primary/10 hover:text-primary'
            }`}
          >
            Tất cả
          </button>
          {categories?.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.slug)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                categoryParam === cat.slug ? 'bg-primary text-white' : 'bg-surface text-gray-600 hover:bg-primary/10 hover:text-primary'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="relative w-full md:w-72">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm kiếm bài viết..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors bg-surface/50 focus:bg-white"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </form>
      </div>

      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : !isLoading && data?.content?.length === 0 ? (
        <EmptyArticles />
      ) : (
        <>
          <ArticleGrid articles={data?.content} loading={isLoading} columns={3} />
          
          {data && data.totalPages > 1 && (
            <div className="mt-16 flex justify-center">
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
  );
}
