import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function Layout() {
  return (
    <div data-theme="dark">
      <Header></Header>
      <div className='container flex'>
        <Sidebar></Sidebar>
        <main className="container mx-auto pt-10 pr-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
