import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chính sách Quyền riêng tư - YLAN',
  description: 'Chính sách quyền riêng tư của YLAN về việc thu thập, sử dụng và bảo vệ thông tin cá nhân.',
  alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-text-dark mb-4">Chính sách Quyền riêng tư</h1>
      <p className="text-gray-500 mb-8">Cập nhật lần cuối: Tháng 10 năm 2024</p>

      <div className="prose prose-lg max-w-none text-text-dark/90 space-y-8">
        <section>
          <h2>1. Thông tin chúng tôi thu thập</h2>
          <p>Khi bạn sử dụng dịch vụ của YLAN, chúng tôi có thể thu thập:</p>
          <ul>
            <li>Thông tin đăng ký: tên, email, số điện thoại</li>
            <li>Thông tin đặt hàng và giao hàng</li>
            <li>Dữ liệu sử dụng website (cookie, IP, trình duyệt)</li>
          </ul>
        </section>
        <section>
          <h2>2. Mục đích sử dụng</h2>
          <p>Thông tin được sử dụng để:</p>
          <ul>
            <li>Xử lý đơn hàng và giao hàng</li>
            <li>Cải thiện dịch vụ và trải nghiệm người dùng</li>
            <li>Gửi thông báo quan trọng về đơn hàng</li>
            <li>Tuân thủ yêu cầu pháp lý</li>
          </ul>
        </section>
        <section>
          <h2>3. Cookie</h2>
          <p>
            YLAN sử dụng cookie để cải thiện trải nghiệm duyệt web. Bạn có thể tắt cookie trong cài đặt trình duyệt,
            tuy nhiên một số tính năng có thể không hoạt động bình thường.
          </p>
        </section>
        <section>
          <h2>4. Chia sẻ thông tin</h2>
          <p>
            Chúng tôi không bán, trao đổi hoặc cho thuê thông tin cá nhân của bạn cho bên thứ ba vì mục đích thương mại.
            Thông tin chỉ được chia sẻ với các đối tác vận chuyển và thanh toán để xử lý đơn hàng.
          </p>
        </section>
        <section>
          <h2>5. Bảo mật thông tin</h2>
          <p>
            Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật và tổ chức phù hợp để bảo vệ thông tin cá nhân của bạn.
          </p>
        </section>
        <section>
          <h2>6. Quyền của bạn</h2>
          <p>Bạn có quyền:</p>
          <ul>
            <li>Truy cập và sửa đổi thông tin cá nhân</li>
            <li>Yêu cầu xóa tài khoản và dữ liệu</li>
            <li>Từ chối nhận email marketing</li>
          </ul>
        </section>
        <section>
          <h2>7. Liên hệ</h2>
          <p>Nếu có thắc mắc về chính sách này, hãy liên hệ: support@ylan.vn</p>
        </section>
      </div>
    </div>
  );
}
