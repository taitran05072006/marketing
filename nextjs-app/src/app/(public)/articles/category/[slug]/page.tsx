import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { fetchApi, REVALIDATE } from '@/lib/api';
import type { ArticleResponse, PageResponse } from '@/types';

export const revalidate = REVALIDATE.ARTICLE_LIST;

interface Props {
  params: { slug: string };
}

async function getArticlesByCategory(slug: string): Promise<PageResponse<ArticleResponse>> {
  try {
    return await fetchApi<PageResponse<ArticleResponse>>(`/articles/category/${slug}?size=12`, {
      next: { revalidate: REVALIDATE.ARTICLE_LIST },
    });
  } catch (error) {
    console.warn(`Could not fetch articles for category ${slug}`);
    return {
      content: [],
      page: 0,
      size: 12,
      totalElements: 0,
      totalPages: 0,
    };
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getArticlesByCategory(params.slug);
  const categoryName = data.content[0]?.categoryName || params.slug;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    title: `${categoryName} - Kiến thức chăm sóc da | YLAN`,
    description: `Tổng hợp các bài viết chuyên sâu về ${categoryName} chuẩn khoa học từ chuyên gia da liễu YLAN.`,
    alternates: {
      canonical: `${siteUrl}/articles/category/${params.slug}`,
    },
    openGraph: {
      title: `${categoryName} | Kiến thức YLAN`,
      description: `Tổng hợp bài viết khoa học về ${categoryName}.`,
    },
  };
}

export default async function ArticleCategoryPage({ params }: Props) {
  const data = await getArticlesByCategory(params.slug);
  const articles = data.content;
  const categoryName = articles[0]?.categoryName || params.slug;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li><Link href="/" className="hover:text-primary">Trang chủ</Link></li>
          <li>/</li>
          <li><Link href="/articles" className="hover:text-primary">Kiến thức</Link></li>
          <li>/</li>
          <li className="text-text-dark font-medium capitalize">{categoryName}</li>
        </ol>
      </nav>

      <header className="mb-12">
        <h1 className="text-4xl font-serif font-bold text-text-dark capitalize">
          {categoryName}
        </h1>
        <p className="text-gray-500 mt-3">
          Có {data.totalElements} bài viết chia sẻ kiến thức trong chủ đề này.
        </p>
      </header>

      {articles.length === 0 ? (
        <div className="text-center py-20 text-gray-500">Chưa có bài viết nào trong danh mục này.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article key={article.id} className="group">
              <Link href={`/articles/${article.slug}`}>
                {article.thumbnailUrl && (
                  <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 bg-surface">
                    <Image
                      src={article.thumbnailUrl}
                      alt={article.thumbnailAlt || article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                )}
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
