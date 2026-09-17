import { Link } from 'react-router-dom';
import { Package, ShoppingCart, BookOpen, Users } from 'lucide-react';
import { useAdminOrders } from '../../hooks/useOrders';
import { useAdminProducts } from '../../hooks/useProducts';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateShort } from '../../utils/formatDate';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../utils/constants';

export function AdminDashboard() {
  const { data: orders } = useAdminOrders(0, 5);
  const { data: products } = useAdminProducts({ page: 0, size: 5 });

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Tổng Đơn Hàng</p>
              <h3 className="text-2xl font-bold text-text-dark">{orders?.totalElements || 0}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Sản Phẩm</p>
              <h3 className="text-2xl font-bold text-text-dark">{products?.totalElements || 0}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-border shadow-sm">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h2 className="text-lg font-bold text-text-dark">Đơn hàng gần đây</h2>
            <Link to="/admin/orders" className="text-sm text-primary hover:underline font-medium">Xem tất cả</Link>
          </div>
          <div className="p-0">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface/50 text-gray-500 text-sm">
                  <th className="py-3 px-6 font-medium">Mã đơn</th>
                  <th className="py-3 px-6 font-medium">Khách hàng</th>
                  <th className="py-3 px-6 font-medium">Trạng thái</th>
                  <th className="py-3 px-6 font-medium text-right">Tổng tiền</th>
                </tr>
              </thead>
              <tbody className="text-sm text-text-dark">
                {orders?.content?.map(order => (
                  <tr key={order.id} className="border-b border-border last:border-0 hover:bg-surface/30">
                    <td className="py-3 px-6 font-medium uppercase">{order.orderCode}</td>
                    <td className="py-3 px-6">{order.customerName}</td>
                    <td className="py-3 px-6">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${ORDER_STATUS_COLORS[order.status]}`}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right font-medium text-primary">
                      {formatCurrency(order.totalAmount)}
                    </td>
                  </tr>
                ))}
                {!orders?.content?.length && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-500">Không có đơn hàng nào</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="bg-white rounded-2xl border border-border shadow-sm">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h2 className="text-lg font-bold text-text-dark">Sản phẩm sắp hết</h2>
            <Link to="/admin/products" className="text-sm text-primary hover:underline font-medium">Xem tất cả</Link>
          </div>
          <div className="p-0">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface/50 text-gray-500 text-sm">
                  <th className="py-3 px-6 font-medium">Tên sản phẩm</th>
                  <th className="py-3 px-6 font-medium text-right">Tồn kho</th>
                </tr>
              </thead>
              <tbody className="text-sm text-text-dark">
                {products?.content?.filter(p => p.stock < 10).slice(0, 5).map(product => (
                  <tr key={product.id} className="border-b border-border last:border-0 hover:bg-surface/30">
                    <td className="py-3 px-6 font-medium">
                      <div className="flex items-center gap-3">
                        {product.primaryImageUrl && <img src={product.primaryImageUrl} alt="" className="w-8 h-8 rounded border object-cover" />}
                        <span className="line-clamp-1">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-right font-medium text-red-600">
                      {product.stock}
                    </td>
                  </tr>
                ))}
                {!products?.content?.some(p => p.stock < 10) && (
                  <tr>
                    <td colSpan={2} className="py-6 text-center text-gray-500">Không có sản phẩm nào sắp hết</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
