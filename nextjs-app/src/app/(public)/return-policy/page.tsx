import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chính sách Đổi trả - YLAN',
  description: 'Chính sách đổi trả sản phẩm của YLAN. Đổi trả trong 30 ngày.',
  alternates: { canonical: '/return-policy' },
};

export default function ReturnPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-text-dark mb-8">Chính sách Đổi trả</h1>
      <div className="prose prose-lg max-w-none text-text-dark/90">
        <h2>Điều kiện đổi trả</h2>
        <ul>
          <li>Sản phẩm còn nguyên seal, chưa sử dụng</li>
          <li>Trong vòng 30 ngày kể từ ngày nhận hàng</li>
          <li>Có hóa đơn mua hàng</li>
          <li>Sản phẩm bị lỗi do nhà sản xuất được đổi trả miễn phí</li>
        </ul>
        <h2>Quy trình đổi trả</h2>
        <ol>
          <li>Liên hệ hotline 1900 1234 hoặc email support@ylan.vn</li>
          <li>Cung cấp mã đơn hàng và lý do đổi trả</li>
          <li>Gửi sản phẩm về địa chỉ của YLAN</li>
          <li>Hoàn tiền trong 3-5 ngày làm việc</li>
        </ol>
        <h2>Trường hợp không được đổi trả</h2>
        <ul>
          <li>Sản phẩm đã qua sử dụng</li>
          <li>Sản phẩm khuyến mãi giảm giá sâu (trừ lỗi sản xuất)</li>
          <li>Quá 30 ngày kể từ ngày nhận hàng</li>
        </ul>
      </div>
    </div>
  );
}
