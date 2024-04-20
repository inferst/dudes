import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
} from '@remix-run/react';
import {
  ExternalScripts,
  ExternalScriptsHandle,
} from 'remix-utils/external-scripts';
import { useChangeLanguage } from 'remix-i18next/react';
import twStyles from './tailwind.css';
import i18next from './i18next.server';
import { useTranslation } from 'react-i18next';
import { getLang } from './utils';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const lang = getLang(params);
  const locale = await i18next.getLocale(request);
  return json({ locale, lang });
}

export const handle: ExternalScriptsHandle = {
  scripts: [
    {
      src: '/yandex.js',
      crossOrigin: 'anonymous',
      preload: true,
    },
  ],
  // i18n: 'common',
};

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
  const { lang } = useLoaderData<typeof loader>();

  const { i18n } = useTranslation();

  // This hook will change the i18n instance language to the current locale
  // detected by the loader, this way, when we do something to change the
  // language, this locale will change and i18next will load the correct
  // translation files
  useChangeLanguage(lang);

  return (
    <html lang={lang} dir={i18n.dir()}>
      <head>
        <Meta />
        <Links />
        <ExternalScripts />
      </head>
      <body className="dark">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/96832653"
              style={{ position: 'absolute', left: '-9999px' }}
              alt=""
            />
          </div>
        </noscript>
      </body>
    </html>
  );
}
