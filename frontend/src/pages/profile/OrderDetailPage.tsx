import { useParams, Link } from 'react-router-dom';
import { useOrderDetail, useCreatePaymentLink } from '../../hooks/useOrders';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../utils/constants';
import { ErrorState } from '../../components/common/ErrorState';
import { Button } from '../../components/common/Button';
import { ArrowLeft, Package, User, MapPin, Phone, CreditCard } from 'lucide-react';
import { useState } from 'react';

export function OrderDetailPage() {
  const { orderCode } = useParams<{ orderCode: string }>();
  const { data: order, isLoading, isError, refetch } = useOrderDetail(orderCode || '');
  const createPayment = useCreatePaymentLink();
  const [paying, setPaying] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-10 w-48 bg-gray-200 rounded mb-8"></div>
        <div className="h-64 bg-gray-200 rounded-2xl mb-8"></div>
        <div className="h-64 bg-gray-200 rounded-2xl"></div>
      </div>
    );
  }

  if (isError || !order) return <ErrorState onRetry={refetch} />;

  const handlePay = async () => {
    try {
      setPaying(true);
      const url = await createPayment.mutateAsync(order.id);
      window.location.href = url;
    } catch (err) {
      alert('Không thể tạo link thanh toán. Vui lòng thử lại sau.');
      setPaying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/orders" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Quay lại danh sách đơn hàng
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-dark mb-2">
            Đơn hàng #{order.orderCode}
          </h1>
          <p className="text-gray-500 text-sm">
            Ngày đặt: {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-4 py-1.5 text-sm font-medium rounded-full ${ORDER_STATUS_COLORS[order.status]}`}>
            {ORDER_STATUS_LABELS[order.status]}
          </span>
          {order.status === 'PENDING' && (
            <Button size="sm" onClick={handlePay} loading={paying}>
              Thanh toán ngay
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 bg-white rounded-2xl p-6 border border-border shadow-sm">
          <h2 className="text-lg font-bold text-text-dark mb-6 flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Sản phẩm đã đặt
          </h2>
          
          <div className="space-y-4">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex-1 pr-4">
                  <Link to={`/products/${item.productId}`} className="font-medium text-text-dark hover:text-primary transition-colors block mb-1">
                    {item.productName}
                  </Link>
                  <p className="text-sm text-gray-500">{formatCurrency(item.price)} x {item.quantity}</p>
                </div>
                <div className="font-bold text-text-dark">
                  {formatCurrency(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex justify-between items-center mb-3 text-gray-600">
              <span>Tạm tính</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between items-center mb-3 text-gray-600">
              <span>Phí vận chuyển</span>
              <span>Miễn phí</span>
            </div>
            <div className="flex justify-between items-center text-lg mt-4">
              <span className="font-bold text-text-dark">Tổng cộng</span>
              <span className="font-bold text-primary">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
            <h2 className="text-lg font-bold text-text-dark mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Thông tin người nhận
            </h2>
            <div className="space-y-3 text-sm">
              <p className="flex items-start gap-3">
                <User className="w-4 h-4 text-gray-400 mt-0.5" />
                <span className="font-medium text-text-dark">{order.customerName}</span>
              </p>
              <p className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                <span className="text-gray-600">{order.customerPhone}</span>
              </p>
              <p className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <span className="text-gray-600 leading-relaxed">{order.shippingAddress}</span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
            <h2 className="text-lg font-bold text-text-dark mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Thanh toán
            </h2>
            <p className="text-sm text-gray-600 mb-2">Phương thức: PayOS</p>
            <p className="text-sm">
              Trạng thái:{' '}
              {order.status === 'PENDING' ? (
                <span className="text-yellow-600 font-medium">Chưa thanh toán</span>
              ) : order.status === 'CANCELLED' ? (
                <span className="text-red-600 font-medium">Đã hủy</span>
              ) : (
                <span className="text-green-600 font-medium">Đã thanh toán</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
