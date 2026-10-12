import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CheckCircle2, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import type { ProductDetailResponse } from '@/types';
import { safeJsonLdReplacer, sanitizeHtml } from '@/lib/sanitizeHtml';

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

// Cấu hình URL Backend: Ưu tiên INTERNAL_API_URL khi chạy Server-Side trong Docker/Node
const API_BASE = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') || 'http://localhost:8080';

/**
 * Hàm lấy dữ liệu sản phẩm từ Backend Spring Boot.
 * Nhờ cơ chế Request Memoization của Next.js, lệnh fetch() này chỉ thực sự gọi 1 lần
 * dù được gọi ở cả generateMetadata() và ProductDetail().
 */
async function getProductBySlug(slug: string): Promise<ProductDetailResponse | null> {
  try {
    // Gọi API Spring Boot: GET /api/products/slug/{slug}
    const res = await fetch(`${API_BASE}/api/products/slug/${slug}`, {
      next: { revalidate: 600 }, // ISR: Cache 10 phút trên server
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch product: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}

/**
 * 1. Hàm tự động sinh thẻ tiêu đề và Open Graph cho công cụ tìm kiếm (Google, Facebook, Zalo)
 */
export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: 'Sản phẩm không tồn tại | YLAN',
      description: 'Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã ngừng kinh doanh.',
      robots: { index: false, follow: false },
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const pageTitle = product.metaTitle || `${product.name} | YLAN Mỹ Phẩm Khoa Học`;
  const pageDescription = product.metaDescription || product.description?.replace(/<[^>]*>?/gm, '').slice(0, 160) || 'Giải pháp chăm sóc da khoa học, an toàn và hiệu quả từ YLAN.';
  const ogImageUrl = product.ogImage || product.imageUrls?.[0] || `${siteUrl}/og-product-default.jpg`;
  const canonicalUrl = `${siteUrl}/products/${product.slug}`;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      siteName: 'YLAN - Skin Science. Better You.',
      locale: 'vi_VN',
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [ogImageUrl],
    },
  };
}

/**
 * 2. Async Server Component chính: Render trực tiếp HTML tĩnh phía máy chủ
 */
export default async function ProductDetail({ params }: ProductDetailPageProps) {
  const product = await getProductBySlug(params.slug);

  // Nếu không tìm thấy trong database -> kích hoạt trang 404 chuẩn của Next.js
  if (!product) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const primaryImage = product.imageUrls?.[0] || '/placeholder-product.png';

  // Định dạng giá tiền VND
  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(Number(product.price));

  // Schema.org Structured Data (JSON-LD) giúp hiển thị giá và trạng thái còn hàng trên Google Rich Snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.metaDescription || product.description?.replace(/<[^>]*>?/gm, '').slice(0, 200),
    image: product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : [primaryImage],
    sku: `YLAN-PROD-${product.id}`,
    brand: {
      '@type': 'Brand',
      name: 'YLAN',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'VND',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${siteUrl}/products/${product.slug}`,
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  return (
    <>
      {/* Schema Markup cho Google Search Bot */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdReplacer(jsonLd) }}
      />

      <div className="bg-bg min-h-screen py-10">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb điều hướng */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-gray-500">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/products" className="hover:text-primary transition-colors">
                  Sản phẩm
                </Link>
              </li>
              <li>/</li>
              {product.categoryName && (
                <>
                  <li>
                    <span className="text-gray-400">{product.categoryName}</span>
                  </li>
                  <li>/</li>
                </>
              )}
              <li className="text-text-dark font-medium truncate max-w-xs" aria-current="page">
                {product.name}
              </li>
            </ol>
          </nav>

          {/* Khối nội dung chính: Bố cục 2 cột bằng Tailwind CSS */}
          <div className="bg-white rounded-3xl p-6 lg:p-10 shadow-sm border border-border grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Cột 1: Thư viện hình ảnh sản phẩm */}
            <div className="space-y-4">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-surface border border-border/50">
                <Image
                  src={primaryImage}
                  alt={`Hình ảnh sản phẩm ${product.name}`}
                  fill
                  priority // Ưu tiên tải ảnh ngay lập tức để tối ưu chỉ số Core Web Vitals (LCP)
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  className="object-cover object-center"
                />
              </div>

              {/* Danh sách ảnh phụ nếu có */}
              {product.imageUrls && product.imageUrls.length > 1 && (
                <div className="grid grid-cols-4 gap-3 pt-2">
                  {product.imageUrls.map((imgUrl, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-xl overflow-hidden bg-surface border border-border hover:border-primary transition-colors"
                    >
                      <Image
                        src={imgUrl}
                        alt={`Ảnh chi tiết ${index + 1} của ${product.name}`}
                        fill
                        sizes="150px"
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cột 2: Thông tin chi tiết & Mua hàng */}
            <div className="flex flex-col justify-between">
              <div className="space-y-6">
                
                {/* Phân loại & Tiêu đề H1 DUY NHẤT chuẩn Technical SEO */}
                <div>
                  {product.categoryName && (
                    <span className="inline-block text-xs font-semibold tracking-wider uppercase text-primary bg-primary/10 px-3 py-1 rounded-full mb-3">
                      {product.categoryName}
                    </span>
                  )}
                  <h1 className="text-3xl sm:text-4xl font-serif font-bold text-text-dark leading-tight">
                    {product.name}
                  </h1>
                </div>

                {/* Giá bán nổi bật */}
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl sm:text-4xl font-bold text-primary">
                    {formattedPrice}
                  </span>
                  {product.stock > 0 ? (
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 bg-green-50 px-3 py-1 rounded-lg">
                      <CheckCircle2 className="w-4 h-4" /> Còn hàng ({product.stock})
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-sm font-medium text-red-600 bg-red-50 px-3 py-1 rounded-lg">
                      Tạm hết hàng
                    </span>
                  )}
                </div>

                <hr className="border-border" />

                {/* Tiêu đề phụ H2: Mô tả ngắn */}
                <div className="space-y-3">
                  <h2 className="text-lg font-serif font-semibold text-text-dark">
                    Mô tả sản phẩm
                  </h2>
                  <div
                    className="text-gray-600 text-sm leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(product.description || '<p>Đang cập nhật thông tin thành phần và công dụng chi tiết...</p>'),
                    }}
                  />
                </div>

                {/* Chính sách cam kết an tâm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2 p-3 bg-surface/60 rounded-xl">
                    <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                    <span>100% Chính hãng & Khoa học</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-surface/60 rounded-xl">
                    <Truck className="w-4 h-4 text-primary shrink-0" />
                    <span>Miễn phí giao hàng từ 500k</span>
                  </div>
                </div>
              </div>

              {/* Nút thao tác Mua sắm */}
              <div className="pt-8 mt-6 border-t border-border flex flex-col sm:flex-row gap-4">
                <Link
                  href={`/checkout?productId=${product.id}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-2xl hover:bg-primary-dark shadow-sm transition-all duration-200"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Mua ngay
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 border border-border text-text-dark font-medium rounded-2xl hover:bg-surface transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Xem sản phẩm khác
                </Link>
              </div>

            </div>

          </div>

          {/* Tiêu đề phụ H2 bổ trợ: Chi tiết thành phần & Hướng dẫn sử dụng */}
          <section className="mt-12 bg-white rounded-3xl p-6 lg:p-10 border border-border">
            <h2 className="text-2xl font-serif font-bold text-text-dark mb-4">
              Cam kết chất lượng YLAN
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Mọi sản phẩm của YLAN đều được phát triển dựa trên các nghiên cứu da liễu lâm sàng, tuân thủ nghiêm ngặt tiêu chuẩn an toàn không cồn khô, không hương liệu nhân tạo gây kích ứng.
            </p>
          </section>

        </main>
      </div>
    </>
  );
}
