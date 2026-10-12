import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Về YLAN - Skin Science. Better You.',
  description: 'YLAN - Thương hiệu chăm sóc da Việt Nam theo tiêu chuẩn khoa học quốc tế.',
  alternates: { canonical: '/about' },
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-text-dark mb-8">Về YLAN</h1>

      <section className="prose prose-lg max-w-none text-text-dark/90">
        <h2>Câu chuyện thương hiệu</h2>
        <p>
          YLAN được thành lập với sứ mệnh mang đến giải pháp chăm sóc da khoa học, an toàn và hiệu quả cho người Việt Nam.
          Chúng tôi tin rằng mọi người đều xứng đáng có một làn da khỏe mạnh thông qua sự hiểu biết khoa học đúng đắn.
        </p>
        <h2>Giá trị cốt lõi</h2>
        <ul>
          <li><strong>Khoa học</strong>: Mọi sản phẩm được nghiên cứu dựa trên căn cứ khoa học</li>
          <li><strong>An toàn</strong>: Chúng tôi ưu tiên sự an toàn cho người dùng</li>
          <li><strong>Hiệu quả</strong>: Kết quả thực sự, đo lường được</li>
          <li><strong>Minh bạch</strong>: Công khai thành phần và nguồn gốc</li>
        </ul>
        <h2>Cam kết</h2>
        <p>
          YLAN cam kết cung cấp thông tin chăm sóc da chính xác, được kiểm chứng khoa học và được biên soạn bởi đội ngũ chuyên gia.
          Tất cả nội dung trên website được kiểm duyệt kỹ lưỡng trước khi xuất bản.
        </p>
      </section>
    </div>
  );
}
