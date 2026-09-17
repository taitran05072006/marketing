import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { ProductGrid } from '../product/ProductGrid';
import { ErrorState } from '../common/ErrorState';
import { EmptyProducts } from '../common/EmptyState';

export function FeaturedProductsSection() {
  const { data, isLoading, isError, refetch } = useProducts({ size: 4 });

  return (
    <section className="py-20 bg-surface/50 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Sản phẩm nổi bật</h2>
            <p className="text-gray-500 max-w-2xl">
              Những lựa chọn được tin dùng nhất, mang lại hiệu quả rõ rệt đã được kiểm chứng.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1 text-primary font-medium hover:underline flex-shrink-0"
          >
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isError ? (
          <ErrorState onRetry={refetch} />
        ) : !isLoading && data?.content?.length === 0 ? (
          <EmptyProducts />
        ) : (
          <ProductGrid 
            products={data?.content} 
            loading={isLoading} 
            skeletonCount={4} 
          />
        )}
      </div>
    </section>
  );
}
