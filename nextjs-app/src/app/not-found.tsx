import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="text-center px-4">
        <div className="text-8xl font-bold text-primary/20 font-serif mb-4">404</div>
        <h1 className="text-3xl font-bold text-text-dark mb-4">Trang không tồn tại</h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-primary text-white font-medium rounded-2xl hover:bg-primary-dark transition-colors"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
