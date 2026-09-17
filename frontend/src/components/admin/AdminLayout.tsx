import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, BookOpen, LogOut, Tags } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function AdminLayout() {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Tổng quan', exact: true },
    { to: '/admin/orders', icon: ShoppingCart, label: 'Đơn hàng' },
    { to: '/admin/products', icon: Package, label: 'Sản phẩm' },
    { to: '/admin/categories', icon: Tags, label: 'Danh mục' },
    { to: '/admin/articles', icon: BookOpen, label: 'Bài viết' },
  ];

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border flex flex-col fixed inset-y-0 z-10">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xs">YL</span>
            </div>
            <span className="font-bold text-primary tracking-tight font-serif">Admin Portal</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.to 
              : location.pathname.startsWith(item.to);
              
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary text-white' 
                    : 'text-gray-600 hover:bg-surface hover:text-primary'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen overflow-x-hidden">
        <header className="h-16 bg-white border-b border-border flex items-center px-8 sticky top-0 z-10">
          <h1 className="text-lg font-bold text-text-dark capitalize">
            {navItems.find(item => item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to))?.label || 'Admin'}
          </h1>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
