import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chính sách Giao hàng - YLAN',
  description: 'Thông tin về chính sách giao hàng của YLAN.',
  alternates: { canonical: '/shipping-policy' },
};

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-text-dark mb-8">Chính sách Giao hàng</h1>
      <div className="prose prose-lg max-w-none text-text-dark/90">
        <h2>Thời gian giao hàng</h2>
        <ul>
          <li><strong>Nội thành TP.HCM:</strong> 1-2 ngày làm việc</li>
          <li><strong>Tỉnh thành khác:</strong> 3-5 ngày làm việc</li>
          <li><strong>Vùng xa:</strong> 5-7 ngày làm việc</li>
        </ul>
        <h2>Phí giao hàng</h2>
        <ul>
          <li>Miễn phí giao hàng cho đơn hàng từ 500.000đ</li>
          <li>Phí giao hàng 30.000đ cho đơn hàng dưới 500.000đ</li>
        </ul>
        <h2>Theo dõi đơn hàng</h2>
        <p>
          Bạn sẽ nhận được email xác nhận và mã vận chuyển sau khi đơn hàng được xử lý.
          Theo dõi đơn hàng qua trang "Đơn hàng của tôi" hoặc website của đơn vị vận chuyển.
        </p>
        <h2>Lưu ý</h2>
        <ul>
          <li>Đơn hàng được xử lý trong giờ làm việc (8:00-22:00)</li>
          <li>Thời gian giao hàng có thể bị ảnh hưởng bởi ngày lễ</li>
          <li>Liên hệ hotline nếu không nhận được hàng sau thời gian dự kiến</li>
        </ul>
      </div>
    </div>
  );
}
