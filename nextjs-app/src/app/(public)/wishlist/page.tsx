'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import apiClient from '@/api/apiClient';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/utils/formatCurrency';

export default function WishlistPage() {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = () => {
    apiClient
      .get('/wishlist')
      .then((res) => {
        setItems(res.data || []);
      })
      .catch(() => {
        setItems([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  const removeItem = async (productId: number) => {
    try {
      await apiClient.delete(`/wishlist/${productId}`);
      setItems((prev) => prev.filter((item) => item.product.id !== productId));
    } catch (err) {
      console.error('Failed to remove from wishlist', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface flex items-center justify-center text-primary">
          <Heart className="w-8 h-8 stroke-1 text-red-500" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-text-dark mb-2">Danh sách yêu thích trống</h1>
        <p className="text-gray-500 mb-8 text-sm">Hãy lưu lại những sản phẩm bạn quan tâm để dễ dàng theo dõi.</p>
        <Link
          href="/products"
          className="inline-block px-8 py-3.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors text-sm"
        >
          Khám phá sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-serif font-bold text-text-dark mb-8">Sản phẩm yêu thích</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => {
          const product = item.product;
          return (
            <div key={item.id} className="group bg-white rounded-2xl border border-border p-4 flex flex-col justify-between">
              <div>
                <div className="relative aspect-square rounded-xl overflow-hidden bg-surface mb-3">
                  {product.primaryImageUrl ? (
                    <Image
                      src={product.primaryImageUrl}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">💊</div>
                  )}
                  <button
                    onClick={() => removeItem(product.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-red-500 hover:bg-red-50 shadow-sm transition-colors"
                    title="Xóa khỏi yêu thích"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <Link href={`/products/${product.slug}`}>
                  <h2 className="font-medium text-text-dark group-hover:text-primary transition-colors line-clamp-2 text-sm">
                    {product.name}
                  </h2>
                </Link>
              </div>

              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                <span className="font-bold text-primary text-sm">
                  {formatCurrency(product.price)}
                </span>
                <Link
                  href={`/products/${product.slug}`}
                  className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
                  title="Xem chi tiết"
                >
                  <ShoppingBag className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
