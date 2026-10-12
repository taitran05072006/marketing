'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import apiClient from '@/api/apiClient';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDateShort } from '@/utils/formatDate';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, OrderStatus } from '@/utils/constants';
import { Package, ArrowRight } from 'lucide-react';

export default function OrderHistoryPage() {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get('/orders/my-orders?page=0&size=20')
      .then((res) => {
        setOrders(res.data.content || []);
      })
      .catch(() => {
        setOrders([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface flex items-center justify-center text-primary">
          <Package className="w-8 h-8 stroke-1" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-text-dark mb-2">Chưa có đơn hàng nào</h1>
        <p className="text-gray-500 mb-8 text-sm">Bạn chưa thực hiện đơn hàng nào trên hệ thống YLAN.</p>
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-serif font-bold text-text-dark mb-8">Đơn hàng của tôi</h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const status = order.status as OrderStatus;
          const statusColor = ORDER_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
          const statusLabel = ORDER_STATUS_LABELS[status] || status;

          return (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-border p-6 hover:shadow-sm transition-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-semibold text-text-dark uppercase">{order.orderCode}</span>
                  <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusColor}`}>
                    {statusLabel}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Ngày đặt: {formatDateShort(order.createdAt)} • Người nhận: {order.customerName}
                </p>
                <p className="text-primary font-bold text-base mt-2">
                  {formatCurrency(order.totalAmount)}
                </p>
              </div>

              <Link
                href={`/orders/${order.orderCode}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-border rounded-xl text-sm font-medium hover:bg-surface text-text-dark transition-colors"
              >
                Xem chi tiết <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
