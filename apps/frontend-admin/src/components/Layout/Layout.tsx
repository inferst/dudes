import { Outlet } from 'react-router';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { AuthProvider } from '../Auth/AuthProvider';

export function Layout() {
  return (
    <AuthProvider>
      <div data-theme="dark">
        <Header></Header>
        <div className="container flex">
          <Sidebar></Sidebar>
          <main className="container mx-auto pt-10 pr-0">
            <Outlet />
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
