import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-xs">YL</span>
              </div>
              <span className="font-bold text-primary text-xl tracking-tight font-serif">YLAN</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Skin Science. Better You.<br />
              Giải pháp chăm sóc da khoa học, an toàn và hiệu quả cho làn da của bạn.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors font-medium text-sm">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors font-medium text-sm">Instagram</a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors font-medium text-sm">Tiktok</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-text-dark mb-4">Về chúng tôi</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-500 hover:text-primary text-sm transition-colors">Câu chuyện thương hiệu</Link></li>
              <li><Link to="/products" className="text-gray-500 hover:text-primary text-sm transition-colors">Sản phẩm</Link></li>
              <li><Link to="/articles" className="text-gray-500 hover:text-primary text-sm transition-colors">Kiến thức chăm sóc da</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-primary text-sm transition-colors">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-text-dark mb-4">Chính sách</h3>
            <ul className="space-y-3">
              <li><Link to="#" className="text-gray-500 hover:text-primary text-sm transition-colors">Chính sách bảo mật</Link></li>
              <li><Link to="#" className="text-gray-500 hover:text-primary text-sm transition-colors">Điều khoản dịch vụ</Link></li>
              <li><Link to="#" className="text-gray-500 hover:text-primary text-sm transition-colors">Chính sách đổi trả</Link></li>
              <li><Link to="#" className="text-gray-500 hover:text-primary text-sm transition-colors">Chính sách giao hàng</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-text-dark mb-4">Liên hệ</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-gray-500">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>123 Đường Dược Mỹ Phẩm, Quận 1, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-500">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <span>1900 1234</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-500">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <span>support@gmskinlab.vn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} YLAN. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex gap-4">
            {/* Placeholder for payment methods */}
            <div className="h-8 w-12 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-[10px] text-gray-400 font-bold">VISA</div>
            <div className="h-8 w-12 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-[10px] text-gray-400 font-bold">MASTER</div>
            <div className="h-8 w-12 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-[10px] text-gray-400 font-bold">ATM</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
