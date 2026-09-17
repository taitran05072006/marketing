import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCart, useClearCart } from '../../hooks/useCart';
import { usePlaceOrder, useCreatePaymentLink } from '../../hooks/useOrders';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Vui lòng nhập họ tên'),
  customerPhone: z.string().min(10, 'Số điện thoại không hợp lệ'),
  shippingAddress: z.string().min(10, 'Vui lòng nhập địa chỉ đầy đủ'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: cart } = useCart();
  const clearCart = useClearCart();
  
  const placeOrder = usePlaceOrder();
  const createPayment = useCreatePaymentLink();

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'PAYOS' | 'COD'>('PAYOS');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: user?.name || '',
      customerPhone: user?.phone || '',
    }
  });

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Giỏ hàng của bạn đang trống</h2>
        <Button onClick={() => navigate('/products')}>Quay lại mua sắm</Button>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      setError('');
      // 1. Place order via API
      const orderRes = await placeOrder.mutateAsync(data);
      
      // 2. Clear cart
      await clearCart.mutateAsync();
      
      // 3. Create payment link with PayOS or COD using the order ID
      const checkoutUrl = await createPayment.mutateAsync({ orderId: orderRes.id, method: paymentMethod });
      
      setSuccess(true);
      
      // Redirect to PayOS after a short delay
      setTimeout(() => {
        window.location.href = checkoutUrl;
      }, 2000);
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tạo đơn hàng.');
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Đặt hàng thành công!</h2>
        <p className="text-gray-600 mb-8">
          {paymentMethod === 'PAYOS' 
            ? 'Đang chuyển hướng đến trang thanh toán an toàn...' 
            : 'Đang chuyển hướng đến trang chi tiết đơn hàng...'}
        </p>
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-text-dark mb-8">Thanh toán</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Form */}
        <div>
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-border shadow-sm">
            <h2 className="text-xl font-bold text-text-dark mb-6">Thông tin giao hàng</h2>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Họ và tên người nhận"
                {...register('customerName')}
                error={errors.customerName?.message}
                required
              />
              <Input
                label="Số điện thoại"
                type="tel"
                {...register('customerPhone')}
                error={errors.customerPhone?.message}
                required
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-dark">
                  Địa chỉ giao hàng chi tiết <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('shippingAddress')}
                  rows={3}
                  className={`w-full px-4 py-2.5 rounded-xl border bg-white text-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none ${
                    errors.shippingAddress ? 'border-red-400' : 'border-border'
                  }`}
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                />
                {errors.shippingAddress && <p className="text-sm text-red-500">{errors.shippingAddress.message}</p>}
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="font-semibold mb-4 text-text-dark">Phương thức thanh toán</h3>
                <div className="space-y-3">
                  <label className={`block p-4 border-2 rounded-xl cursor-pointer transition-colors ${paymentMethod === 'PAYOS' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                    <div className="flex items-start gap-3">
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="PAYOS" 
                        checked={paymentMethod === 'PAYOS'} 
                        onChange={() => setPaymentMethod('PAYOS')}
                        className="mt-1 text-primary focus:ring-primary" 
                      />
                      <div>
                        <p className={`font-medium ${paymentMethod === 'PAYOS' ? 'text-primary' : 'text-text-dark'}`}>Thanh toán trực tuyến (PayOS)</p>
                        <p className="text-sm text-gray-500">Chuyển khoản QR code, thẻ ATM, Visa/Mastercard</p>
                      </div>
                    </div>
                  </label>
                  
                  <label className={`block p-4 border-2 rounded-xl cursor-pointer transition-colors ${paymentMethod === 'COD' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                    <div className="flex items-start gap-3">
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="COD" 
                        checked={paymentMethod === 'COD'} 
                        onChange={() => setPaymentMethod('COD')}
                        className="mt-1 text-primary focus:ring-primary" 
                      />
                      <div>
                        <p className={`font-medium ${paymentMethod === 'COD' ? 'text-primary' : 'text-text-dark'}`}>Thanh toán khi nhận hàng (COD)</p>
                        <p className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="bg-surface rounded-3xl p-6 md:p-8 border border-border sticky top-24">
            <h2 className="text-xl font-bold text-text-dark mb-6">Đơn hàng của bạn</h2>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {cart.items.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-white rounded-lg overflow-hidden border border-border flex-shrink-0 relative">
                    {item.primaryImageUrl && <img src={item.primaryImageUrl} alt={item.productName} className="w-full h-full object-cover" />}
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-text-dark line-clamp-2">{item.productName}</h4>
                    <p className="text-sm font-bold text-primary mt-1">{formatCurrency(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-border">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span>{formatCurrency(cart.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>
              <div className="pt-4 mt-2 border-t border-gray-200">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-text-dark text-lg">Tổng cộng</span>
                  <span className="text-3xl font-bold text-primary">{formatCurrency(cart.totalAmount)}</span>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              form="checkout-form" 
              fullWidth 
              size="lg" 
              className="mt-8"
              loading={placeOrder.isPending || createPayment.isPending || success}
            >
              Thanh toán ngay
            </Button>
            <p className="text-center text-xs text-gray-500 mt-4">
              Bằng việc đặt hàng, bạn đồng ý với Điều khoản dịch vụ của chúng tôi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
