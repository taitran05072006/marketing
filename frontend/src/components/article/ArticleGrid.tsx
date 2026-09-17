import type { ArticleResponse } from '../../types/article.types';
import { ArticleCard } from './ArticleCard';
import { ArticleSkeleton } from '../common/LoadingSkeleton';

interface ArticleGridProps {
  articles?: ArticleResponse[];
  loading?: boolean;
  columns?: 2 | 3;
}

export function ArticleGrid({ articles, loading = false, columns = 3 }: ArticleGridProps) {
  const gridClass = columns === 2
    ? 'grid grid-cols-1 sm:grid-cols-2 gap-6'
    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6';

  if (loading) {
    return (
      <div className={gridClass}>
        {Array.from({ length: 6 }).map((_, i) => (
          <ArticleSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className={gridClass}>
      {articles?.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
