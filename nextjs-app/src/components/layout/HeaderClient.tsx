'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function HeaderClient() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { href: '/', label: 'Trang chủ' },
    { href: '/products', label: 'Sản phẩm' },
    { href: '/articles', label: 'Kiến thức' },
    { href: '/about', label: 'Về chúng tôi' },
    { href: '/contact', label: 'Liên hệ' },
  ];

  return (
    <>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-text-dark hover:text-primary hover:bg-primary/5 transition-colors"
          aria-label="Tìm kiếm"
        >
          <Search className="w-5 h-5" />
        </button>
        <Link
          href="/cart"
          className="relative w-9 h-9 rounded-lg flex items-center justify-center text-text-dark hover:text-primary hover:bg-primary/5 transition-colors"
          aria-label="Giỏ hàng"
        >
          <ShoppingCart className="w-5 h-5" />
        </Link>
        <Link
          href="/login"
          className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-text-dark hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
        >
          <User className="w-4 h-4" />
          Đăng nhập
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-text-dark hover:bg-primary/5 transition-colors"
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {searchOpen && (
        <div className="absolute top-full left-0 right-0 border-t border-border bg-white shadow-md">
          <div className="max-w-2xl mx-auto px-4 py-3">
            <form onSubmit={handleSearch} className="flex items-center gap-3">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                autoFocus
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
              <button type="submit" className="text-sm font-medium text-primary hover:underline">Tìm</button>
            </form>
          </div>
        </div>
      )}

      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 lg:hidden border-t border-border bg-white shadow-lg">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm font-medium rounded-xl transition-colors text-text-dark hover:text-primary hover:bg-primary/5"
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-border my-2" />
            <Link href="/login" className="px-4 py-3 text-sm font-medium rounded-xl text-primary hover:bg-primary/5 transition-colors">
              Đăng nhập
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
