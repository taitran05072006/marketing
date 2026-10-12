import { Metadata } from 'next';
import Link from 'next/link';
import { fetchApi, REVALIDATE } from '@/lib/api';
import { ArticleResponse, PageResponse } from '@/types';

export const revalidate = REVALIDATE.ARTICLE_LIST;

export const metadata: Metadata = {
  title: 'Kiến thức chăm sóc da - YLAN',
  description: 'Khám phá các bài viết về chăm sóc da, làm đẹp khoa học và các sản phẩm chăm sóc da chất lượng cao tại YLAN.',
  alternates: { canonical: '/articles' },
  openGraph: {
    title: 'Kiến thức chăm sóc da - YLAN',
    description: 'Khám phá các bài viết về chăm sóc da tại YLAN',
  },
};

async function getArticles(): Promise<PageResponse<ArticleResponse>> {
  try {
    return await fetchApi<PageResponse<ArticleResponse>>('/articles?size=12', {
      next: { revalidate: REVALIDATE.ARTICLE_LIST },
    });
  } catch (error) {
    console.warn('Backend not reachable during build/prerender for /articles, returning empty list');
    return {
      content: [],
      page: 0,
      size: 12,
      totalElements: 0,
      totalPages: 0,
    };
  }
}

export default async function ArticlesPage() {
  const data = await getArticles();
  const articles = data.content;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-text-dark">Kiến thức chăm sóc da</h1>
        <p className="text-gray-500 mt-3">
          Bài viết khoa học từ các chuyên gia da liễu
        </p>
      </header>

      {articles.length === 0 ? (
        <div className="text-center py-20 text-gray-500">Chưa có bài viết nào.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article key={article.id} className="group">
              <Link href={`/articles/${article.slug}`}>
                {article.thumbnailUrl && (
                  <div className="aspect-video rounded-2xl overflow-hidden mb-4">
                    <img
                      src={article.thumbnailUrl}
                      alt={article.thumbnailAlt || article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      width={640}
                      height={360}
                    />
                  </div>
                )}
                <div className="text-xs text-primary font-medium mb-2 uppercase tracking-wider">
                  {article.categoryName}
                </div>
                <h2 className="font-semibold text-text-dark group-hover:text-primary transition-colors line-clamp-2 text-lg">
                  {article.title}
                </h2>
                {article.excerpt && (
                  <p className="text-gray-500 text-sm mt-2 line-clamp-3">{article.excerpt}</p>
                )}
                <div className="mt-4 text-xs text-gray-400">
                  {article.authorName} &bull; {new Date(article.publishedAt || article.createdAt).toLocaleDateString('vi-VN')}
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
