'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/api/apiClient';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDateShort } from '@/utils/formatDate';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, OrderStatus } from '@/utils/constants';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    apiClient
      .get('/admin/orders?page=0&size=50')
      .then((res) => {
        setOrders(res.data.content || []);
      })
      .catch(() => {
        setOrders([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: number, status: string) => {
    try {
      await apiClient.put(`/admin/orders/${orderId}/status?status=${status}`);
      fetchOrders();
    } catch (e) {
      console.error('Failed to update order status', e);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-text-dark">Quản lý Đơn hàng</h1>
        <p className="text-gray-500 text-sm mt-1">Danh sách đơn hàng của khách hàng</p>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Đang tải đơn hàng...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-400">Chưa có đơn hàng nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-surface/50 text-gray-500 border-b border-border">
                  <th className="py-3 px-6 font-medium">Mã đơn</th>
                  <th className="py-3 px-6 font-medium">Khách hàng</th>
                  <th className="py-3 px-6 font-medium">Số điện thoại</th>
                  <th className="py-3 px-6 font-medium">Tổng tiền</th>
                  <th className="py-3 px-6 font-medium">Trạng thái</th>
                  <th className="py-3 px-6 font-medium">Ngày đặt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((o) => {
                  const status = o.status as OrderStatus;
                  const statusColor = ORDER_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';

                  return (
                    <tr key={o.id} className="hover:bg-surface/30">
                      <td className="py-3 px-6 font-bold uppercase">{o.orderCode}</td>
                      <td className="py-3 px-6">{o.customerName}</td>
                      <td className="py-3 px-6 text-gray-600">{o.customerPhone}</td>
                      <td className="py-3 px-6 font-bold text-primary">{formatCurrency(o.totalAmount)}</td>
                      <td className="py-3 px-6">
                        <select
                          value={o.status}
                          onChange={(e) => updateStatus(o.id, e.target.value)}
                          className={`text-xs font-semibold rounded-lg px-2.5 py-1 outline-none border border-border ${statusColor}`}
                        >
                          {Object.entries(ORDER_STATUS_LABELS).map(([val, label]) => (
                            <option key={val} value={val}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-6 text-gray-500">{formatDateShort(o.createdAt)}</td>
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
