import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Điều khoản dịch vụ - YLAN',
  description: 'Điều khoản sử dụng dịch vụ của YLAN.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-text-dark mb-4">Điều khoản Dịch vụ</h1>
      <p className="text-gray-500 mb-8">Cập nhật lần cuối: Tháng 10 năm 2024</p>
      <div className="prose prose-lg max-w-none text-text-dark/90">
        <h2>1. Chấp thuận điều khoản</h2>
        <p>Bằng việc truy cập website YLAN, bạn đồng ý tuân theo các điều khoản này.</p>
        <h2>2. Sử dụng dịch vụ</h2>
        <p>Bạn cam kết sử dụng dịch vụ hợp pháp, không vi phạm quyền lợi của người khác và không thực hiện các hành vi gian lận.</p>
        <h2>3. Sản phẩm và giá cả</h2>
        <p>YLAN bảo lưu quyền thay đổi giá sản phẩm mà không cần thông báo trước. Đơn hàng đã đặt sẽ được tính theo giá tại thời điểm đặt hàng.</p>
        <h2>4. Điều khoản mua hàng</h2>
        <p>Xem chính sách mua hàng, đổi trả và giao hàng tại các trang riêng biệt.</p>
        <h2>5. Quyền sở hữu trí tuệ</h2>
        <p>Tất cả nội dung trên website (văn bản, hình ảnh, logo) là tài sản của YLAN và được bảo hộ bản quyền.</p>
        <h2>6. Giới hạn trách nhiệm</h2>
        <p>YLAN không chịu trách nhiệm về thiệt hại gián tiếp phát sinh từ việc sử dụng dịch vụ.</p>
      </div>
    </div>
  );
}
