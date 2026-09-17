import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMyOrders } from '../../hooks/useOrders';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateShort } from '../../utils/formatDate';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../utils/constants';
import { Badge } from '../../components/common/Badge';
import { Pagination } from '../../components/common/Pagination';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { Package } from 'lucide-react';

export function OrderHistoryPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError, refetch } = useMyOrders(page, 10);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-10 w-48 bg-gray-200 rounded mb-8"></div>
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>)}
        </div>
      </div>
    );
  }

  if (isError) return <ErrorState onRetry={refetch} />;

  if (!data?.content || data.content.length === 0) {
    return (
      <div className="py-20">
        <EmptyState
          icon={<Package className="w-16 h-16 text-gray-300" />}
          title="Chưa có đơn hàng nào"
          description="Bạn chưa thực hiện đơn hàng nào trên hệ thống."
          action={{
            label: 'Mua sắm ngay',
            onClick: () => window.location.href = '/products'
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-text-dark mb-8">Đơn hàng của tôi</h1>

      <div className="space-y-6">
        {data.content.map(order => (
          <div key={order.id} className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-surface px-6 py-4 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Mã đơn: <span className="font-semibold text-text-dark uppercase">{order.orderCode}</span></p>
                <p className="text-xs text-gray-500">Ngày đặt: {formatDateShort(order.createdAt)}</p>
              </div>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${ORDER_STATUS_COLORS[order.status]}`}>
                {ORDER_STATUS_LABELS[order.status]}
              </span>
            </div>
            
            <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Tổng tiền:</p>
                <p className="text-xl font-bold text-primary">{formatCurrency(order.totalAmount)}</p>
              </div>
              
              <Link 
                to={`/orders/${order.orderCode}`}
                className="px-5 py-2.5 border border-primary text-primary text-sm font-medium rounded-xl hover:bg-primary/5 transition-colors"
              >
                Xem chi tiết
              </Link>
            </div>
          </div>
        ))}
      </div>

      <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
    </div>
  );
}
