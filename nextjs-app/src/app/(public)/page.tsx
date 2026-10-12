import { Metadata } from 'next';
import Link from 'next/link';
import { fetchApi, REVALIDATE } from '@/lib/api';
import { ProductResponse, ArticleResponse, PageResponse } from '@/types';

export const revalidate = REVALIDATE.HOME;

export const metadata: Metadata = {
  title: 'YLAN - Skin Science. Better You.',
  description: 'Giải pháp chăm sóc da khoa học, an toàn và hiệu quả. Khám phá sản phẩm chăm sóc da tiêu chuẩn quốc tế tại YLAN.',
  openGraph: {
    title: 'YLAN - Skin Science. Better You.',
    description: 'Giải pháp chăm sóc da khoa học, an toàn và hiệu quả.',
    images: [{ url: '/og-home.jpg', width: 1200, height: 630 }],
  },
};

async function getFeaturedProducts() {
  try {
    const data = await fetchApi<PageResponse<ProductResponse>>('/products?size=6', {
      next: { revalidate: REVALIDATE.HOME },
    });
    return data.content.filter((p) => p.isFeatured).slice(0, 6);
  } catch {
    return [];
  }
}

async function getLatestArticles() {
  try {
    const data = await fetchApi<PageResponse<ArticleResponse>>('/articles?size=3', {
      next: { revalidate: REVALIDATE.HOME },
    });
    return data.content.slice(0, 3);
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [featuredProducts, latestArticles] = await Promise.all([
    getFeaturedProducts(),
    getLatestArticles(),
  ]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-bg to-accent/10 py-24 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              Skin Science
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-text-dark leading-tight">
              Chăm sóc da
              <span className="text-primary block">khoa học</span>
              thực sự hiệu quả
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-lg">
              Khám phá bí quyết làn da khỏe đẹp với các sản phẩm được nghiên cứu kỹ lưỡng, chứng minh hiệu quả bằng khoa học.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="px-8 py-4 bg-primary text-white font-medium rounded-2xl hover:bg-primary-dark transition-colors"
              >
                Khám phá sản phẩm
              </Link>
              <Link
                href="/articles"
                className="px-8 py-4 border border-primary text-primary font-medium rounded-2xl hover:bg-primary/5 transition-colors"
              >
                Đọc kiến thức
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-accent/30 flex items-center justify-center">
              <div className="text-center text-primary/40">
                <div className="text-8xl font-serif font-bold">YL</div>
                <div className="text-xl mt-2">Skin Science</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-4xl font-bold text-text-dark">Sản phẩm nổi bật</h2>
                <p className="text-gray-500 mt-2">Bộ sưu tập được yêu thích nhất</p>
              </div>
              <Link href="/products" className="text-primary hover:underline text-sm font-medium">Xem tất cả →</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`} className="group">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-surface mb-4">
                    {product.primaryImageUrl ? (
                      <img
                        src={product.primaryImageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <span className="text-4xl">💊</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium text-text-dark group-hover:text-primary transition-colors">{product.name}</h3>
                  <p className="text-primary font-semibold mt-1">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Articles */}
      {latestArticles.length > 0 && (
        <section className="py-20 bg-surface/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-4xl font-bold text-text-dark">Kiến thức chăm sóc da</h2>
                <p className="text-gray-500 mt-2">Bài viết mới nhất từ chuyên gia</p>
              </div>
              <Link href="/articles" className="text-primary hover:underline text-sm font-medium">Xem tất cả →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestArticles.map((article) => (
                <article key={article.id}>
                  <Link href={`/articles/${article.slug}`} className="group">
                    {article.thumbnailUrl && (
                      <div className="aspect-video rounded-2xl overflow-hidden mb-4">
                        <img
                          src={article.thumbnailUrl}
                          alt={article.thumbnailAlt || article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="text-xs text-primary font-medium mb-2">{article.categoryName}</div>
                    <h3 className="font-semibold text-text-dark group-hover:text-primary transition-colors line-clamp-2">{article.title}</h3>
                    {article.excerpt && (
                      <p className="text-gray-500 text-sm mt-2 line-clamp-2">{article.excerpt}</p>
                    )}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Bắt đầu hành trình làn da khỏe mạnh
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Khám phá sản phẩm chăm sóc da khoa học, được hàng ngàn khách hàng tin dùng.
          </p>
          <Link
            href="/products"
            className="inline-block px-10 py-4 bg-white text-primary font-semibold rounded-2xl hover:bg-gray-50 transition-colors"
          >
            Mua sắm ngay
          </Link>
        </div>
      </section>
    </div>
  );
}
