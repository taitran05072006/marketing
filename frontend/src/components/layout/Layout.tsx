import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-16 lg:pt-18">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}
