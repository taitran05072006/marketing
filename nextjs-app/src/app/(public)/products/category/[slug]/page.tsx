import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { fetchApi, REVALIDATE } from '@/lib/api';
import type { ProductResponse, PageResponse } from '@/types';

export const revalidate = REVALIDATE.PRODUCT_LIST;

interface Props {
  params: { slug: string };
}

async function getProductsByCategory(slug: string): Promise<PageResponse<ProductResponse>> {
  try {
    return await fetchApi<PageResponse<ProductResponse>>(`/products/category/${slug}?size=24`, {
      next: { revalidate: REVALIDATE.PRODUCT_LIST },
    });
  } catch (error) {
    console.warn(`Could not fetch products for category ${slug}`);
    return {
      content: [],
      page: 0,
      size: 24,
      totalElements: 0,
      totalPages: 0,
    };
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getProductsByCategory(params.slug);
  const categoryName = data.content[0]?.categoryName || params.slug;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    title: `${categoryName} - Sản phẩm chăm sóc da | YLAN`,
    description: `Khám phá các sản phẩm thuộc danh mục ${categoryName} chất lượng cao, an toàn và chuẩn khoa học tại YLAN.`,
    alternates: {
      canonical: `${siteUrl}/products/category/${params.slug}`,
    },
    openGraph: {
      title: `${categoryName} | YLAN Mỹ Phẩm Khoa Học`,
      description: `Danh mục sản phẩm ${categoryName} chăm sóc da khoa học.`,
    },
  };
}

export default async function ProductCategoryPage({ params }: Props) {
  const data = await getProductsByCategory(params.slug);
  const products = data.content;
  const categoryName = products[0]?.categoryName || params.slug;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li><Link href="/" className="hover:text-primary">Trang chủ</Link></li>
          <li>/</li>
          <li><Link href="/products" className="hover:text-primary">Sản phẩm</Link></li>
          <li>/</li>
          <li className="text-text-dark font-medium capitalize">{categoryName}</li>
        </ol>
      </nav>

      <header className="mb-12">
        <h1 className="text-4xl font-serif font-bold text-text-dark capitalize">
          {categoryName}
        </h1>
        <p className="text-gray-500 mt-3">
          Có {data.totalElements} sản phẩm phù hợp trong danh mục này.
        </p>
      </header>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">Chưa có sản phẩm nào trong danh mục này.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <article key={product.id}>
              <Link href={`/products/${product.slug}`} className="group">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface mb-4">
                  {product.primaryImageUrl ? (
                    <Image
                      src={product.primaryImageUrl}
                      alt={`Sản phẩm ${product.name}`}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <span className="text-4xl">💊</span>
                    </div>
                  )}
                </div>
                <h2 className="font-medium text-text-dark group-hover:text-primary transition-colors line-clamp-2">
                  {product.name}
                </h2>
                <p className="text-primary font-semibold mt-2">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                </p>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
