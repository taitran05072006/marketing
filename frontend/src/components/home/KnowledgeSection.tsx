import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useArticles } from '../../hooks/useArticles';
import { ArticleGrid } from '../article/ArticleGrid';
import { ErrorState } from '../common/ErrorState';
import { EmptyArticles } from '../common/EmptyState';

export function KnowledgeSection() {
  const { data, isLoading, isError, refetch } = useArticles({ size: 3 });

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Góc kiến thức</h2>
          <p className="text-gray-500 max-w-2xl mx-auto mb-6">
            Khám phá các bài viết chuyên sâu về da liễu để hiểu rõ hơn về làn da của bạn.
          </p>
          <Link
            to="/articles"
            className="inline-flex items-center gap-1 text-primary font-medium hover:underline"
          >
            Đọc thêm <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isError ? (
          <ErrorState onRetry={refetch} />
        ) : !isLoading && data?.content?.length === 0 ? (
          <EmptyArticles />
        ) : (
          <ArticleGrid 
            articles={data?.content} 
            loading={isLoading} 
            columns={3} 
          />
        )}
      </div>
    </section>
  );
}
