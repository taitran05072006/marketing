import { Metadata } from 'next';
import Link from 'next/link';
import { fetchApi, REVALIDATE } from '@/lib/api';
import { ProductResponse, PageResponse } from '@/types';

export const revalidate = REVALIDATE.PRODUCT_LIST;

export const metadata: Metadata = {
  title: 'Sản phẩm chăm sóc da - YLAN',
  description: 'Khám phá bộ sưu tập sản phẩm chăm sóc da khoa học, an toàn và hiệu quả tại YLAN.',
  alternates: { canonical: '/products' },
};

async function getProducts(): Promise<PageResponse<ProductResponse>> {
  try {
    return await fetchApi<PageResponse<ProductResponse>>('/products?size=24', {
      next: { revalidate: REVALIDATE.PRODUCT_LIST },
    });
  } catch (error) {
    console.warn('Backend not reachable during build/prerender for /products, returning empty list');
    return {
      content: [],
      page: 0,
      size: 24,
      totalElements: 0,
      totalPages: 0,
    };
  }
}

export default async function ProductsPage() {
  const data = await getProducts();
  const products = data.content;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-text-dark">Sản phẩm</h1>
        <p className="text-gray-500 mt-3">{data.totalElements} sản phẩm chăm sóc da</p>
      </header>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">Chưa có sản phẩm nào.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <article key={product.id}>
              <Link href={`/products/${product.slug}`} className="group">
                <div className="aspect-square rounded-2xl overflow-hidden bg-surface mb-4">
                  {product.primaryImageUrl ? (
                    <img
                      src={product.primaryImageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      width={400}
                      height={400}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <span className="text-4xl">💊</span>
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500 mb-1">{product.categoryName}</div>
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
