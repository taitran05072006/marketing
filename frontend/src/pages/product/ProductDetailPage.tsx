import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useProduct } from '../../hooks/useProducts';
import { useAddToCart } from '../../hooks/useCart';
import { useToggleWishlist, useCheckWishlist } from '../../hooks/useWishlist';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { ProductGallery } from '../../components/product/ProductGallery';
import { Button } from '../../components/common/Button';
import { ErrorState } from '../../components/common/ErrorState';
import { Badge } from '../../components/common/Badge';
import { ReviewSection } from '../../components/review/ReviewSection';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const { data: product, isLoading, isError, refetch } = useProduct(slug || '');
  const addToCart = useAddToCart();
  const toggleWishlist = useToggleWishlist();
  
  // Conditionally check wishlist if product is loaded
  const { data: inWishlist = false } = useCheckWishlist(product?.id || 0);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-gray-200 rounded-3xl"></div>
          <div className="space-y-6">
            <div className="h-4 bg-gray-200 w-1/4 rounded"></div>
            <div className="h-10 bg-gray-200 w-3/4 rounded"></div>
            <div className="h-8 bg-gray-200 w-1/3 rounded"></div>
            <div className="h-32 bg-gray-200 w-full rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return <ErrorState onRetry={refetch} title="Không tìm thấy sản phẩm" />;
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addToCart.mutate({ productId: product.id, quantity: 1 });
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    toggleWishlist.mutate({ productId: product.id, inWishlist });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Product Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="md:sticky md:top-24 h-max">
          <ProductGallery 
            imageUrls={product.imageUrls?.length > 0 ? product.imageUrls : [product.primaryImageUrl]} 
            productName={product.name} 
          />
        </div>

        <div>
          <div className="mb-6">
            <Badge variant="primary" className="mb-3 uppercase tracking-wider">{product.categoryName}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-text-dark mb-4 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-end gap-4 mb-6">
              <span className="text-3xl font-bold text-primary">{formatCurrency(product.price)}</span>
              {product.stock > 0 ? (
                <span className="text-sm text-green-600 font-medium mb-1.5 bg-green-50 px-2.5 py-0.5 rounded">Còn hàng ({product.stock})</span>
              ) : (
                <span className="text-sm text-red-600 font-medium mb-1.5 bg-red-50 px-2.5 py-0.5 rounded">Hết hàng</span>
              )}
            </div>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
              {product.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-10 pt-6 border-t border-border">
            <Button 
              size="lg" 
              className="flex-1"
              onClick={handleAddToCart}
              loading={addToCart.isPending}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="w-5 h-5" />
              Thêm vào giỏ hàng
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleWishlist}
            >
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
              {inWishlist ? 'Đã yêu thích' : 'Yêu thích'}
            </Button>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-surface rounded-2xl border border-border">
            <div className="flex flex-col items-center text-center gap-2">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <span className="text-xs font-medium text-text-dark">Cam kết chính hãng</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <Truck className="w-6 h-6 text-primary" />
              <span className="text-xs font-medium text-text-dark">Giao hàng toàn quốc</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <RotateCcw className="w-6 h-6 text-primary" />
              <span className="text-xs font-medium text-text-dark">Đổi trả 7 ngày</span>
            </div>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="border-t border-border pt-12">
        {/* We need to pass purchasedOrderItems to ReviewSection if the user is authenticated. 
            For now we pass an empty array, in a fully integrated system we'd fetch if user bought this. */}
        <ReviewSection productId={product.id} purchasedOrderItems={[]} />
      </div>
    </div>
  );
}
