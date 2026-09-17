import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { ProtectedRoute } from './ProtectedRoute';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ProductListPage } from '../pages/product/ProductListPage';
import { ProductDetailPage } from '../pages/product/ProductDetailPage';
import { ArticleListPage } from '../pages/article/ArticleListPage';
import { ArticleDetailPage } from '../pages/article/ArticleDetailPage';
import { SearchPage } from '../pages/search/SearchPage';
import { CartPage } from '../pages/cart/CartPage';
import { CheckoutPage } from '../pages/checkout/CheckoutPage';
import { WishlistPage } from '../pages/profile/WishlistPage';
import { OrderHistoryPage } from '../pages/profile/OrderHistoryPage';
import { OrderDetailPage } from '../pages/profile/OrderDetailPage';
import { AdminLayout } from '../components/admin/AdminLayout';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminOrdersPage } from '../pages/admin/AdminOrdersPage';
import { AdminProductsPage } from '../pages/admin/AdminProductsPage';
import { AdminCategoriesPage } from '../pages/admin/AdminCategoriesPage';
import { AdminArticlesPage } from '../pages/admin/AdminArticlesPage';

// Placeholder components until we implement them
const Placeholder = ({ title }: { title: string }) => (
  <div className="py-20 text-center"><h1 className="text-2xl font-bold">{title}</h1><p>Đang xây dựng...</p></div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'products', element: <ProductListPage /> },
      { path: 'products/:slug', element: <ProductDetailPage /> },
      { path: 'articles', element: <ArticleListPage /> },
      { path: 'articles/:slug', element: <ArticleDetailPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'about', element: <Placeholder title="Về Chúng Tôi" /> },
      { path: 'contact', element: <Placeholder title="Liên Hệ" /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      
      // Protected Routes (User)
      { path: 'cart', element: <ProtectedRoute><CartPage /></ProtectedRoute> },
      { path: 'wishlist', element: <ProtectedRoute><WishlistPage /></ProtectedRoute> },
      { path: 'checkout', element: <ProtectedRoute><CheckoutPage /></ProtectedRoute> },
      { path: 'orders', element: <ProtectedRoute><OrderHistoryPage /></ProtectedRoute> },
      { path: 'orders/:orderCode', element: <ProtectedRoute><OrderDetailPage /></ProtectedRoute> },
    ],
  },
  {
    path: '/admin',
    element: <ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'orders', element: <AdminOrdersPage /> },
      { path: 'products', element: <AdminProductsPage /> },
      { path: 'categories', element: <AdminCategoriesPage /> },
      { path: 'articles', element: <AdminArticlesPage /> },
    ]
  }
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
