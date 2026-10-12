import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { fetchApi, REVALIDATE, NotFoundError } from '@/lib/api';
import { ArticleDetailResponse } from '@/types';
import { sanitizeHtml, safeJsonLdReplacer } from '@/lib/sanitizeHtml';

export const revalidate = REVALIDATE.ARTICLE_DETAIL;

type Props = {
  params: { slug: string };
};

async function getArticle(slug: string) {
  return fetchApi<ArticleDetailResponse>(`/articles/${slug}`, {
    next: { revalidate: REVALIDATE.ARTICLE_DETAIL },
  });
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  try {
    const article = await getArticle(params.slug);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const canonical = article.canonicalUrl || `${siteUrl}/articles/${article.slug}`;

    return {
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt || '',
      alternates: { canonical },
      openGraph: {
        title: article.metaTitle || article.title,
        description: article.metaDescription || article.excerpt || '',
        images: article.ogImage ? [{ url: article.ogImage }] : article.thumbnailUrl ? [{ url: article.thumbnailUrl }] : [],
        type: 'article',
        publishedTime: article.publishedAt,
        modifiedTime: article.updatedAt,
        authors: [article.authorName],
        section: article.categoryName,
      },
    };
  } catch {
    return { title: 'Bài viết' };
  }
}

export default async function ArticleDetailPage({ params }: Props) {
  let article: ArticleDetailResponse;

  try {
    article = await getArticle(params.slug);
  } catch (e) {
    if (e instanceof NotFoundError) notFound();
    throw e;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt || article.metaDescription || '',
    image: article.ogImage || article.thumbnailUrl,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { '@type': 'Person', name: article.authorName },
    publisher: { '@type': 'Organization', name: 'YLAN', url: siteUrl },
    articleSection: article.categoryName,
    url: `${siteUrl}/articles/${article.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdReplacer(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-primary">Trang chủ</Link></li>
            <li>/</li>
            <li><Link href="/articles" className="hover:text-primary">Kiến thức</Link></li>
            <li>/</li>
            <li className="text-text-dark font-medium truncate max-w-xs">{article.title}</li>
          </ol>
        </nav>

        <header className="mb-10 text-center">
          {article.categoryName && (
            <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
              {article.categoryName}
            </span>
          )}
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-text-dark mb-6 leading-tight">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            {article.authorName && (
              <span>Tác giả: {article.authorName}</span>
            )}
            {article.publishedAt && (
              <time dateTime={article.publishedAt}>
                {new Date(article.publishedAt).toLocaleDateString('vi-VN')}
              </time>
            )}
          </div>
        </header>

        {article.thumbnailUrl && (
          <div className="relative aspect-video rounded-3xl overflow-hidden mb-12 shadow-md bg-surface">
            <Image
              src={article.thumbnailUrl}
              alt={article.thumbnailAlt || `Hình ảnh bài viết ${article.title}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        )}

        <div
          className="prose prose-lg prose-green max-w-none mb-16 text-text-dark/90 leading-loose
            prose-headings:font-serif prose-headings:text-primary
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-2xl prose-img:shadow-sm"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }}
        />

        {article.relatedProducts && article.relatedProducts.length > 0 && (
          <div className="border-t border-border pt-12 mb-16">
            <h3 className="text-2xl font-bold text-text-dark mb-8">Sản phẩm được đề cập</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {article.relatedProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`} className="group">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-surface mb-3">
                    {product.primaryImageUrl && (
                      <img
                        src={product.primaryImageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <h4 className="font-medium text-sm group-hover:text-primary transition-colors">{product.name}</h4>
                  <p className="text-primary text-sm font-semibold">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
