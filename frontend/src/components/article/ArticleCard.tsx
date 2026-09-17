import { useState } from 'react';
import { formatDate } from '../../utils/formatDate';
import type { ArticleResponse } from '../../types/article.types';
import { Link } from 'react-router-dom';

interface ArticleCardProps {
  article: ArticleResponse;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      to={`/articles/${article.slug}`}
      className="group bg-white rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 block"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-surface">
        {!imgError && article.thumbnailUrl ? (
          <img
            src={article.thumbnailUrl}
            alt={article.thumbnailAlt || article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
        )}
        {article.categoryName && (
          <div className="absolute top-3 left-3 bg-primary/90 text-white text-xs font-medium px-2.5 py-1 rounded-full">
            {article.categoryName}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {article.publishedAt && (
          <p className="text-xs text-gray-400 mb-2">{formatDate(article.publishedAt)}</p>
        )}
        <h3 className="font-semibold text-text-dark leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{article.excerpt}</p>
        )}
        {article.authorName && (
          <p className="text-xs text-secondary mt-3 font-medium">{article.authorName}</p>
        )}
      </div>
    </Link>
  );
}
