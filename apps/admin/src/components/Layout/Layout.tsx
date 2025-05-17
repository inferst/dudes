import { Outlet } from 'react-router';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { AuthProvider } from '../Auth/AuthProvider';
import { Footer } from './Footer';

export function Layout() {
  return (
    <AuthProvider>
      <div data-theme="dark" className="flex flex-col min-h-screen">
        <Header />
        <div className="container flex grow">
          <Sidebar />
          <main className="grow pt-10 pl-10">
            <Outlet />
          </main>
        </div>
        <Footer />
      </div>
    </AuthProvider>
  );
}
