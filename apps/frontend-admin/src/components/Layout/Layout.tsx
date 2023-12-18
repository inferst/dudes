import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '@app/frontend-admin/components/Auth/useAuth';
import styles from './Layout.module.css';

export function Layout() {
  const { user } = useAuth();

  return (
    <div className="hero" data-theme="dark">
      <nav className="container-fluid">
        <ul>
          <li>
            <Link to="/">
              <strong>Dudes</strong>
            </Link>
          </li>
        </ul>
        <ul>
          <li>
            <details role="list" dir="rtl">
              <summary
                aria-haspopup="listbox"
                role="link"
                className={`${styles.summary} contrast`}
              >
                <div>{user?.name}</div>
                <img
                  src={user?.picture}
                  alt="avatar"
                  className={styles.avatar}
                />
              </summary>
              <ul role="listbox">
                <li>
                  <a href="http://localhost:3000/auth/logout">Logout</a>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </nav>
      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}
