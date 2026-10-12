import { Metadata } from 'next';
import { ContactForm } from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Liên hệ - YLAN',
  description: 'Liên hệ với YLAN. Chúng tôi sẵn sàng hỗ trợ bạn 7 ngày/tuần.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-text-dark mb-8">Liên hệ</h1>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-semibold text-text-dark mb-6">Thông tin liên hệ</h2>
          <div className="space-y-4 text-gray-600">
            <p><strong>Email:</strong> support@ylan.vn</p>
            <p><strong>Hotline:</strong> 1900 1234</p>
            <p><strong>Giờ làm việc:</strong> 8:00 - 22:00 (Thứ 2 - Chủ Nhật)</p>
            <p><strong>Địa chỉ:</strong> 123 Đường Dược Mỹ Phẩm, Quận 1, TP. Hồ Chí Minh</p>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-text-dark mb-6">Gửi tin nhắn</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
