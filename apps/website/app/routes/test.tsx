import type { LinksFunction } from '@remix-run/node';

import stylesUrl from '../styles/test.css';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }];
};
export default function Test() {
  return <p>Test works!</p>;
}
