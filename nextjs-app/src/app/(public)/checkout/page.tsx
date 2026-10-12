'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import apiClient from '@/api/apiClient';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/utils/formatCurrency';
import { AlertCircle, CheckCircle2, CreditCard, ShieldCheck } from 'lucide-react';

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Vui lòng nhập họ tên'),
  customerPhone: z.string().min(10, 'Số điện thoại không hợp lệ'),
  shippingAddress: z.string().min(10, 'Vui lòng nhập địa chỉ đầy đủ'),
  note: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'PAYOS' | 'COD'>('PAYOS');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  useEffect(() => {
    if (user) {
      if (user.name) setValue('customerName', user.name);
      if (user.phone) setValue('customerPhone', user.phone);
    }

    apiClient
      .get('/cart')
      .then((res) => {
        setCart(res.data);
      })
      .catch(() => {
        setCart(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user, setValue]);

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      setError('');
      setSubmitting(true);

      // 1. Tạo đơn hàng
      const orderRes = await apiClient.post('/orders', data);
      const createdOrder = orderRes.data;

      // 2. Nếu thanh toán online qua PayOS
      if (paymentMethod === 'PAYOS') {
        const paymentRes = await apiClient.post(`/payments/create-link/${createdOrder.id}`);
        if (paymentRes.data.checkoutUrl) {
          window.location.href = paymentRes.data.checkoutUrl;
          return;
        }
      }

      // 3. Hoàn tất đơn hàng COD
      router.push(`/orders/${createdOrder.orderCode}`);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại sau.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
        <div className="h-64 bg-gray-200 rounded-2xl"></div>
      </div>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-serif font-bold text-text-dark mb-4">Giỏ hàng của bạn đang trống</h1>
        <p className="text-gray-500 mb-8 text-sm">Vui lòng chọn sản phẩm trước khi thanh toán.</p>
        <Link
          href="/products"
          className="inline-block px-8 py-3.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors text-sm"
        >
          Khám phá sản phẩm
        </Link>
      </div>
    );
  }

  const shippingFee = cart.totalAmount >= 500000 ? 0 : 30000;
  const finalTotal = cart.totalAmount + shippingFee;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-serif font-bold text-text-dark mb-8">Thanh toán đơn hàng</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Thông tin giao hàng */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-border space-y-4">
            <h2 className="font-serif font-bold text-lg text-text-dark">1. Thông tin người nhận</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">Họ tên *</label>
                <input
                  type="text"
                  {...register('customerName')}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-primary text-sm text-text-dark"
                />
                {errors.customerName && (
                  <p className="text-xs text-red-600 mt-1">{errors.customerName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">Số điện thoại *</label>
                <input
                  type="tel"
                  {...register('customerPhone')}
                  placeholder="0912345678"
                  className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-primary text-sm text-text-dark"
                />
                {errors.customerPhone && (
                  <p className="text-xs text-red-600 mt-1">{errors.customerPhone.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Địa chỉ nhận hàng *</label>
              <textarea
                rows={3}
                {...register('shippingAddress')}
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-primary text-sm text-text-dark resize-none"
              />
              {errors.shippingAddress && (
                <p className="text-xs text-red-600 mt-1">{errors.shippingAddress.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Ghi chú (Tùy chọn)</label>
              <input
                type="text"
                {...register('note')}
                placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao"
                className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-primary text-sm text-text-dark"
              />
            </div>
          </div>

          {/* Phương thức thanh toán */}
          <div className="bg-white rounded-2xl p-6 border border-border space-y-4">
            <h2 className="font-serif font-bold text-lg text-text-dark">2. Phương thức thanh toán</h2>
            <div className="space-y-3">
              <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${paymentMethod === 'PAYOS' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'PAYOS'}
                  onChange={() => setPaymentMethod('PAYOS')}
                  className="accent-primary"
                />
                <CreditCard className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <div className="font-medium text-sm text-text-dark">Chuyển khoản QR qua ngân hàng (PayOS)</div>
                  <div className="text-xs text-gray-500">Quét mã QR qua ứng dụng ngân hàng hoặc thẻ ATM nội địa</div>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${paymentMethod === 'COD' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="accent-primary"
                />
                <ShieldCheck className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <div className="font-medium text-sm text-text-dark">Thanh toán khi nhận hàng (COD)</div>
                  <div className="text-xs text-gray-500">Kiểm tra hàng và thanh toán tiền mặt cho nhân viên giao vận</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Tóm tắt đơn hàng */}
        <div className="bg-white rounded-2xl p-6 border border-border h-fit space-y-4">
          <h2 className="font-serif font-bold text-lg text-text-dark">Đơn hàng của bạn</h2>
          
          <div className="divide-y divide-border/60 max-h-60 overflow-y-auto pr-1">
            {cart.items.map((item: any) => (
              <div key={item.id} className="py-2.5 flex justify-between text-xs">
                <span className="text-gray-700 truncate max-w-[180px]">
                  {item.productName} <span className="text-gray-400">×{item.quantity}</span>
                </span>
                <span className="font-medium text-text-dark">{formatCurrency(item.subtotal)}</span>
              </div>
            ))}
          </div>

          <hr className="border-border" />

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Tạm tính:</span>
              <span>{formatCurrency(cart.totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển:</span>
              <span className="text-green-600">
                {shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)}
              </span>
            </div>
          </div>

          <hr className="border-border" />

          <div className="flex justify-between font-bold text-base text-text-dark">
            <span>Tổng thanh toán:</span>
            <span className="text-primary text-xl font-bold">{formatCurrency(finalTotal)}</span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors text-sm disabled:opacity-60"
          >
            {submitting ? 'Đang tạo đơn hàng...' : 'Xác nhận đặt hàng'}
          </button>
        </div>
      </form>
    </div>
  );
}
