import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart, useUpdateCartQuantity, useRemoveFromCart, useClearCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatCurrency';
import { Button } from '../../components/common/Button';
import { EmptyCart } from '../../components/common/EmptyState';

export function CartPage() {
  const navigate = useNavigate();
  const { data: cart, isLoading } = useCart();
  const updateQuantity = useUpdateCartQuantity();
  const remove = useRemoveFromCart();
  const clear = useClearCart();

  const handleUpdateQuantity = (itemId: number, currentQty: number, change: number) => {
    const newQty = currentQty + change;
    if (newQty > 0) {
      updateQuantity.mutate({ itemId, quantity: newQty });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-10 w-48 bg-gray-200 rounded mb-8"></div>
        <div className="space-y-4">
          {[1,2].map(i => <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>)}
        </div>
      </div>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="py-20">
        <EmptyCart />
        <div className="text-center mt-6">
          <Button onClick={() => navigate('/products')}>Tiếp tục mua sắm</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-text-dark mb-8">Giỏ hàng của bạn</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-2xl border border-border">
              <Link to={`/products/${item.productId}`} className="w-24 h-24 flex-shrink-0 bg-surface rounded-xl overflow-hidden">
                {item.primaryImageUrl ? (
                  <img src={item.primaryImageUrl} alt={item.productName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                )}
              </Link>
              
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start gap-4">
                  <Link to={`/products/${item.productId}`} className="font-semibold text-text-dark hover:text-primary transition-colors">
                    {item.productName}
                  </Link>
                  <button 
                    onClick={() => remove.mutate(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Xóa sản phẩm"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-border rounded-lg bg-surface/50">
                    <button 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                      disabled={item.quantity <= 1 || updateQuantity.isPending}
                      className="p-2 text-gray-500 hover:text-primary disabled:opacity-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                      disabled={updateQuantity.isPending}
                      className="p-2 text-gray-500 hover:text-primary"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">{formatCurrency(item.price * item.quantity)}</div>
                    <div className="text-xs text-gray-500">{formatCurrency(item.price)} / sản phẩm</div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <button 
              onClick={() => {
                if (window.confirm('Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?')) {
                  clear.mutate();
                }
              }}
              className="text-sm text-red-500 hover:underline font-medium"
            >
              Xóa toàn bộ giỏ hàng
            </button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-surface rounded-3xl p-6 border border-border sticky top-24">
            <h2 className="text-lg font-bold text-text-dark mb-4">Tóm tắt đơn hàng</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Tạm tính ({cart.items.reduce((a, b) => a + b.quantity, 0)} sản phẩm)</span>
                <span>{formatCurrency(cart.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-text-dark">Tổng cộng</span>
                  <span className="text-2xl font-bold text-primary">{formatCurrency(cart.totalAmount)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-right">(Đã bao gồm VAT nếu có)</p>
              </div>
            </div>

            <Button 
              fullWidth 
              size="lg" 
              onClick={() => navigate('/checkout')}
            >
              Tiến hành thanh toán
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
