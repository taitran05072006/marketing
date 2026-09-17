import { useState } from 'react';
import { useAdminOrders, useUpdateOrderStatus } from '../../hooks/useOrders';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateShort } from '../../utils/formatDate';
import { Pagination } from '../../components/common/Pagination';
import { ErrorState } from '../../components/common/ErrorState';
import type { OrderStatus } from '../../types/common.types';

export function AdminOrdersPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError, refetch } = useAdminOrders(page, 15);
  const updateStatus = useUpdateOrderStatus();

  const handleStatusChange = (orderCode: string, newStatus: string) => {
    if (window.confirm(`Xác nhận chuyển trạng thái đơn hàng thành: ${ORDER_STATUS_LABELS[newStatus as OrderStatus]}?`)) {
      updateStatus.mutate({ orderCode, status: newStatus });
    }
  };

  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold text-text-dark">Quản lý Đơn hàng</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface/50 text-gray-500 text-sm border-b border-border">
              <th className="py-4 px-6 font-medium whitespace-nowrap">Mã đơn</th>
              <th className="py-4 px-6 font-medium whitespace-nowrap">Khách hàng</th>
              <th className="py-4 px-6 font-medium whitespace-nowrap">Ngày đặt</th>
              <th className="py-4 px-6 font-medium whitespace-nowrap text-right">Tổng tiền</th>
              <th className="py-4 px-6 font-medium whitespace-nowrap">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="text-sm text-text-dark">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border animate-pulse">
                  <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                  <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                  <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                  <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-20 ml-auto"></div></td>
                  <td className="py-4 px-6"><div className="h-8 bg-gray-200 rounded w-32"></div></td>
                </tr>
              ))
            ) : data?.content?.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-500">Chưa có đơn hàng nào</td>
              </tr>
            ) : (
              data?.content?.map(order => (
                <tr key={order.id} className="border-b border-border hover:bg-surface/30 transition-colors">
                  <td className="py-4 px-6 font-medium uppercase text-primary">{order.orderCode}</td>
                  <td className="py-4 px-6">
                    <div className="font-medium">{order.customerName}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{order.customerPhone}</div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{formatDateShort(order.createdAt)}</td>
                  <td className="py-4 px-6 text-right font-bold text-primary">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.orderCode, e.target.value)}
                      disabled={updateStatus.isPending || order.status === 'CANCELLED'}
                      className={`text-xs font-medium rounded-lg px-3 py-1.5 border-r-8 border-transparent outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${ORDER_STATUS_COLORS[order.status]}`}
                    >
                      {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                        <option key={value} value={value} className="text-text-dark bg-white">
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data && data.totalPages > 1 && (
        <div className="p-4 border-t border-border flex justify-center">
          <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
