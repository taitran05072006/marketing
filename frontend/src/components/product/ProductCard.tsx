import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import type { ProductResponse } from '../../types/product.types';
import { formatCurrency } from '../../utils/formatCurrency';
import { useAddToCart } from '../../hooks/useCart';
import { useToggleWishlist, useCheckWishlist } from '../../hooks/useWishlist';
import { useAuth } from '../../context/AuthContext';

interface ProductCardProps {
  product: ProductResponse;
}

export function ProductCard({ product }: ProductCardProps) {
  const { isAuthenticated } = useAuth();
  const [imgError, setImgError] = useState(false);

  const addToCart = useAddToCart();
  const toggleWishlist = useToggleWishlist();
  const { data: inWishlist = false } = useCheckWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    addToCart.mutate({ productId: product.id, quantity: 1 });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    toggleWishlist.mutate({ productId: product.id, inWishlist });
  };

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group bg-white rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 block"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-surface">
        {!imgError && product.primaryImageUrl ? (
          <img
            src={product.primaryImageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {product.isFeatured && (
          <div className="absolute top-3 left-3 bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            Nổi bật
          </div>
        )}

        {/* Wishlist button */}
        {isAuthenticated && (
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
            aria-label={inWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
          >
            <Heart
              className={`w-4.5 h-4.5 transition-colors ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
            />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-secondary font-medium mb-1 uppercase tracking-wide">
          {product.categoryName}
        </p>
        <h3 className="font-semibold text-text-dark text-sm leading-snug mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center justify-between gap-2">
          <span className="text-base font-bold text-primary">
            {formatCurrency(product.price)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={addToCart.isPending}
            className="flex items-center gap-1.5 text-xs font-medium text-white bg-primary hover:bg-primary-dark rounded-full px-3 py-1.5 transition-colors disabled:opacity-60"
            aria-label="Thêm vào giỏ hàng"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {addToCart.isPending ? '...' : 'Thêm'}
          </button>
        </div>
      </div>
    </Link>
  );
}
