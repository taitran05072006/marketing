'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import apiClient from '@/api/apiClient';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, OrderStatus } from '@/utils/constants';
import { ArrowLeft, CheckCircle2, Clock, MapPin, Package, Phone, User } from 'lucide-react';

export default function OrderDetailPage() {
  const params = useParams();
  const orderCode = params.orderCode as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderCode) return;
    apiClient
      .get(`/orders/code/${orderCode}`)
      .then((res) => {
        setOrder(res.data);
      })
      .catch((err) => {
        console.error('Failed to load order:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [orderCode]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
        <div className="h-64 bg-gray-200 rounded-2xl"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-serif font-bold text-text-dark mb-4">Không tìm thấy đơn hàng</h1>
        <p className="text-gray-500 mb-8 text-sm">Mã đơn hàng không hợp lệ hoặc bạn không có quyền xem đơn hàng này.</p>
        <Link
          href="/orders"
          className="inline-block px-8 py-3.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors text-sm"
        >
          Quay lại danh sách đơn hàng
        </Link>
      </div>
    );
  }

  const status = order.status as OrderStatus;
  const statusColor = ORDER_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
  const statusLabel = ORDER_STATUS_LABELS[status] || status;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/orders"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách đơn hàng
      </Link>

      <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-8">
        {/* Header đơn hàng */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-border">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-serif font-bold text-text-dark">
                Đơn hàng #{order.orderCode}
              </h1>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
                {statusLabel}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Đặt ngày {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        {/* Thông tin giao hàng */}
        <div className="grid sm:grid-cols-2 gap-6 bg-surface/50 rounded-2xl p-5 border border-border/50 text-sm">
          <div>
            <h2 className="font-semibold text-text-dark mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> Người nhận
            </h2>
            <p className="text-gray-700">{order.customerName}</p>
            <p className="text-gray-500 mt-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> {order.customerPhone}
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-text-dark mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> Địa chỉ giao hàng
            </h2>
            <p className="text-gray-700 leading-relaxed">{order.shippingAddress}</p>
            {order.note && (
              <p className="text-xs text-gray-500 mt-1 italic">Ghi chú: {order.note}</p>
            )}
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="space-y-4">
          <h2 className="font-serif font-bold text-lg text-text-dark">Sản phẩm</h2>
          <div className="divide-y divide-border">
            {order.items?.map((item: any) => (
              <div key={item.id} className="py-4 flex justify-between items-center text-sm">
                <div>
                  <h3 className="font-medium text-text-dark">{item.productName}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {formatCurrency(item.price)} × {item.quantity}
                  </p>
                </div>
                <span className="font-semibold text-text-dark">
                  {formatCurrency(item.subtotal)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tổng thanh toán */}
        <div className="pt-6 border-t border-border flex justify-between items-center">
          <span className="text-base text-gray-600 font-medium">Tổng tiền thanh toán:</span>
          <span className="text-2xl font-bold text-primary">{formatCurrency(order.totalAmount)}</span>
        </div>
      </div>
    </div>
  );
}
