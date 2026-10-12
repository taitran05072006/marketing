'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, ShoppingCart, BookOpen, TrendingUp } from 'lucide-react';
import apiClient from '@/api/apiClient';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDateShort } from '@/utils/formatDate';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, OrderStatus } from '@/utils/constants';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalArticles: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.get('/admin/orders?page=0&size=5').catch(() => ({ data: { content: [], totalElements: 0 } })),
      apiClient.get('/admin/products?page=0&size=5').catch(() => ({ data: { totalElements: 0 } })),
      apiClient.get('/admin/articles?page=0&size=5').catch(() => ({ data: { totalElements: 0 } })),
    ])
      .then(([ordersRes, prodRes, artRes]) => {
        setStats({
          totalOrders: ordersRes.data.totalElements || 0,
          totalProducts: prodRes.data.totalElements || 0,
          totalArticles: artRes.data.totalElements || 0,
        });
        setRecentOrders(ordersRes.data.content || []);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-text-dark">Tổng quan hệ thống</h1>
        <p className="text-gray-500 text-sm mt-1">Báo cáo tình hình kinh doanh và dữ liệu nội dung</p>
      </div>

      {/* Thẻ thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Tổng Đơn Hàng</p>
            <h3 className="text-2xl font-bold text-text-dark">{stats.totalOrders}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Sản Phẩm</p>
            <h3 className="text-2xl font-bold text-text-dark">{stats.totalProducts}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Bài Viết</p>
            <h3 className="text-2xl font-bold text-text-dark">{stats.totalArticles}</h3>
          </div>
        </div>
      </div>

      {/* Đơn hàng gần đây */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-lg font-bold text-text-dark font-serif">Đơn hàng mới nhất</h2>
          <Link href="/admin/orders" className="text-sm text-primary hover:underline font-medium">
            Xem tất cả →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">Chưa có đơn hàng nào phát sinh.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-surface/50 text-gray-500 border-b border-border">
                  <th className="py-3 px-6 font-medium">Mã đơn</th>
                  <th className="py-3 px-6 font-medium">Khách hàng</th>
                  <th className="py-3 px-6 font-medium">Trạng thái</th>
                  <th className="py-3 px-6 font-medium">Ngày đặt</th>
                  <th className="py-3 px-6 font-medium text-right">Tổng tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentOrders.map((order) => {
                  const status = order.status as OrderStatus;
                  const statusColor = ORDER_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
                  const statusLabel = ORDER_STATUS_LABELS[status] || status;

                  return (
                    <tr key={order.id} className="hover:bg-surface/30">
                      <td className="py-3 px-6 font-semibold uppercase">{order.orderCode}</td>
                      <td className="py-3 px-6">{order.customerName}</td>
                      <td className="py-3 px-6">
                        <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusColor}`}>
                          {statusLabel}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-gray-500">{formatDateShort(order.createdAt)}</td>
                      <td className="py-3 px-6 text-right font-bold text-primary">
                        {formatCurrency(order.totalAmount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
