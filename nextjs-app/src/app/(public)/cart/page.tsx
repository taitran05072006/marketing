'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import apiClient from '@/api/apiClient';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/utils/formatCurrency';

interface CartItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
  primaryImageUrl?: string;
  slug?: string;
}

interface CartResponse {
  id: number;
  items: CartItem[];
  totalAmount: number;
  totalQuantity: number;
}

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await apiClient.get<CartResponse>('/cart');
      setCart(res.data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const updateQuantity = async (itemId: number, newQty: number) => {
    if (newQty <= 0) return;
    try {
      await apiClient.put(`/cart/items/${itemId}`, { quantity: newQty });
      fetchCart();
    } catch (e) {
      console.error('Failed to update quantity', e);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      await apiClient.delete(`/cart/items/${itemId}`);
      fetchCart();
    } catch (e) {
      console.error('Failed to remove item', e);
    }
  };

  const clearCart = async () => {
    try {
      await apiClient.delete('/cart');
      fetchCart();
    } catch (e) {
      console.error('Failed to clear cart', e);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface flex items-center justify-center text-primary">
          <ShoppingBag className="w-10 h-10 stroke-1" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-text-dark mb-2">Giỏ hàng của bạn đang trống</h1>
        <p className="text-gray-500 mb-8 text-sm">
          Hãy khám phá các sản phẩm chăm sóc da khoa học tại YLAN để chọn cho mình sản phẩm phù hợp.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors text-sm"
        >
          Khám phá sản phẩm <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-bold text-text-dark">Giỏ hàng của bạn</h1>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:underline"
        >
          Xóa toàn bộ
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-border"
            >
              <div className="relative w-20 h-20 flex-shrink-0 bg-surface rounded-xl overflow-hidden">
                {item.primaryImageUrl ? (
                  <Image
                    src={item.primaryImageUrl}
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">💊</div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-text-dark text-sm truncate">{item.productName}</h3>
                <p className="text-primary font-semibold text-sm mt-1">
                  {formatCurrency(item.price)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-surface text-gray-600"
                  disabled={item.quantity <= 1}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-surface text-gray-600"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Xóa sản phẩm"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Tổng quan đơn hàng */}
        <div className="bg-white rounded-2xl p-6 border border-border h-fit space-y-4">
          <h2 className="font-serif font-bold text-lg text-text-dark">Tóm tắt đơn hàng</h2>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Tổng số lượng:</span>
            <span>{cart.totalQuantity} sản phẩm</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Tạm tính:</span>
            <span>{formatCurrency(cart.totalAmount)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Phí vận chuyển:</span>
            <span className="text-green-600">
              {cart.totalAmount >= 500000 ? 'Miễn phí' : '30.000 ₫'}
            </span>
          </div>
          <hr className="border-border" />
          <div className="flex justify-between font-bold text-base text-text-dark">
            <span>Tổng cộng:</span>
            <span className="text-primary text-xl font-bold">
              {formatCurrency(
                cart.totalAmount >= 500000 ? cart.totalAmount : cart.totalAmount + 30000
              )}
            </span>
          </div>
          <Link
            href="/checkout"
            className="w-full inline-block text-center py-3.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors text-sm"
          >
            Tiến hành đặt hàng
          </Link>
        </div>
      </div>
    </div>
  );
}
