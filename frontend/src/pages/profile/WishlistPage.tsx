import { Link } from 'react-router-dom';
import { useWishlist } from '../../hooks/useWishlist';
import { ProductCard } from '../../components/product/ProductCard';
import { EmptyState } from '../../components/common/EmptyState';
import { Heart } from 'lucide-react';
import { ErrorState } from '../../components/common/ErrorState';

export function WishlistPage() {
  const { data: wishlist, isLoading, isError, refetch } = useWishlist();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
        <div className="h-10 w-48 bg-gray-200 rounded mb-8"></div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="aspect-square bg-gray-200 rounded-2xl"></div>)}
        </div>
      </div>
    );
  }

  if (isError) {
    return <ErrorState onRetry={refetch} />;
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="py-20">
        <EmptyState
          icon={<Heart className="w-16 h-16 text-gray-300" />}
          title="Danh sách yêu thích trống"
          description="Lưu những sản phẩm bạn yêu thích để xem lại sau."
          action={{
            label: 'Khám phá sản phẩm',
            onClick: () => window.location.href = '/products'
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-text-dark">Sản phẩm yêu thích</h1>
      </div>
      
      <p className="text-gray-500 mb-8">
        Bạn có {wishlist.length} sản phẩm trong danh sách yêu thích.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
