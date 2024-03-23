import type { MetaFunction, LinksFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import twStyles from './tailwind.css';
export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: twStyles },
];

export const meta: MetaFunction = () => [
  {
    charset: 'utf-8',
    title: 'Dudes for your stream',
    viewport: 'width=device-width,initial-scale=1',
  },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="dark">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        {process.env.NODE_ENV === 'production' && (
          <>
            <script src="/yandex.js" />
            <noscript>
              <div>
                <img
                  src="https://mc.yandex.ru/watch/96832653"
                  style={{ position: 'absolute', left: '-9999px' }}
                  alt=""
                />
              </div>
            </noscript>
          </>
        )}
      </body>
    </html>
  );
}
