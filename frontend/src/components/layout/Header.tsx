import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../hooks/useCart';

export function Header() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { data: cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { to: '/', label: 'Trang chủ' },
    { to: '/products', label: 'Sản phẩm' },
    { to: '/articles', label: 'Kiến thức chăm sóc da' },
    { to: '/about', label: 'Về chúng tôi' },
    { to: '/contact', label: 'Liên hệ' },
  ];

  return (
    <header
      className={[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-border' : 'bg-white border-b border-border/50',
      ].join(' ')}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xs">YL</span>
            </div>
            <div>
              <span className="font-bold text-primary text-lg tracking-tight font-serif">YLAN</span>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={[
                  'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  location.pathname === link.to
                    ? 'text-primary bg-primary/8'
                    : 'text-text-dark hover:text-primary hover:bg-primary/5',
                ].join(' ')}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-text-dark hover:text-primary hover:bg-primary/5 transition-colors"
              aria-label="Tìm kiếm"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist - only authenticated */}
            {isAuthenticated && (
              <Link
                to="/wishlist"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-text-dark hover:text-primary hover:bg-primary/5 transition-colors"
                aria-label="Yêu thích"
              >
                <Heart className="w-5 h-5" />
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative w-9 h-9 rounded-lg flex items-center justify-center text-text-dark hover:text-primary hover:bg-primary/5 transition-colors"
              aria-label="Giỏ hàng"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* User account */}
            {isAuthenticated ? (
              <div className="relative hidden lg:block" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-text-dark hover:text-primary hover:bg-primary/5 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                    {user?.email?.charAt(0)?.toUpperCase()}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-lg border border-border py-2 animate-in fade-in slide-in-from-top-2 duration-150">
                    <Link to="/orders" className="block px-4 py-2.5 text-sm text-text-dark hover:bg-surface transition-colors">
                      Đơn hàng của tôi
                    </Link>
                    <Link to="/wishlist" className="block px-4 py-2.5 text-sm text-text-dark hover:bg-surface transition-colors">
                      Danh sách yêu thích
                    </Link>
                    {isAdmin && (
                      <>
                        <hr className="my-1.5 border-border" />
                        <Link to="/admin" className="block px-4 py-2.5 text-sm text-primary font-medium hover:bg-surface transition-colors">
                          Quản trị
                        </Link>
                      </>
                    )}
                    <hr className="my-1.5 border-border" />
                    <button
                      onClick={() => { logout(); navigate('/'); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-surface transition-colors"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-text-dark hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
                Đăng nhập
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-text-dark hover:bg-primary/5 transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Search bar dropdown */}
      {searchOpen && (
        <div className="border-t border-border bg-white">
          <div className="max-w-2xl mx-auto px-4 py-3">
            <form onSubmit={handleSearch} className="flex items-center gap-3">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm sản phẩm, bài viết..."
                className="flex-1 text-sm outline-none text-text-dark placeholder:text-gray-400"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="text-sm font-medium text-primary hover:underline"
              >
                Tìm
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-white shadow-lg">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={[
                  'px-4 py-3 text-sm font-medium rounded-xl transition-colors',
                  location.pathname === link.to
                    ? 'text-primary bg-primary/8'
                    : 'text-text-dark hover:text-primary hover:bg-primary/5',
                ].join(' ')}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-border my-2" />
            {isAuthenticated ? (
              <>
                <Link to="/orders" className="px-4 py-3 text-sm font-medium rounded-xl text-text-dark hover:bg-primary/5 transition-colors">
                  Đơn hàng của tôi
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="px-4 py-3 text-sm font-medium rounded-xl text-primary hover:bg-primary/5 transition-colors">
                    Quản trị
                  </Link>
                )}
                <button
                  onClick={() => { logout(); navigate('/'); setMobileOpen(false); }}
                  className="text-left px-4 py-3 text-sm font-medium rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-3 text-sm font-medium rounded-xl text-primary hover:bg-primary/5 transition-colors">
                  Đăng nhập
                </Link>
                <Link to="/register" className="px-4 py-3 text-sm font-medium rounded-xl text-text-dark hover:bg-primary/5 transition-colors">
                  Đăng ký
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
