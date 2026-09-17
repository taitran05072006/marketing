import { useParams, Link } from 'react-router-dom';
import { useArticle } from '../../hooks/useArticles';
import { formatDate } from '../../utils/formatDate';
import { Badge } from '../../components/common/Badge';
import { ErrorState } from '../../components/common/ErrorState';
import { ProductCard } from '../../components/product/ProductCard';
import { CommentSection } from '../../components/comment/CommentSection';
import { ArrowLeft, User, Calendar } from 'lucide-react';

export function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, isError, refetch } = useArticle(slug || '');

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-6 w-24 bg-gray-200 rounded mb-6"></div>
        <div className="h-12 w-3/4 bg-gray-200 rounded mb-4"></div>
        <div className="h-6 w-1/2 bg-gray-200 rounded mb-8"></div>
        <div className="aspect-video bg-gray-200 rounded-3xl mb-12"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (isError || !article) {
    return <ErrorState onRetry={refetch} title="Không tìm thấy bài viết" />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/articles" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Trở về danh sách
      </Link>

      <header className="mb-10 text-center">
        {article.categoryName && (
          <Badge variant="primary" className="mb-6 uppercase tracking-wider">{article.categoryName}</Badge>
        )}
        <h1 className="text-3xl md:text-5xl font-bold text-text-dark mb-6 leading-tight">
          {article.title}
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
          {article.authorName && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{article.authorName}</span>
            </div>
          )}
          {article.publishedAt && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
          )}
        </div>
      </header>

      {article.thumbnailUrl && (
        <div className="aspect-video rounded-3xl overflow-hidden mb-12 shadow-md">
          <img 
            src={article.thumbnailUrl} 
            alt={article.thumbnailAlt || article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Prose styling for the HTML content coming from backend */}
      <div 
        className="prose prose-lg prose-green max-w-none mb-16 text-text-dark/90 leading-loose
          prose-headings:font-serif prose-headings:text-primary
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-2xl prose-img:shadow-sm"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Related Products */}
      {article.relatedProducts && article.relatedProducts.length > 0 && (
        <div className="border-t border-border pt-12 mb-16">
          <h3 className="text-2xl font-bold text-text-dark mb-8">Sản phẩm được đề cập</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {article.relatedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Comments */}
      <div className="border-t border-border pt-8">
        <CommentSection articleId={article.id} />
      </div>
    </div>
  );
}
