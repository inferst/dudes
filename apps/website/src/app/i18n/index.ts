import i18next from './i18next';
import { headerName } from './settings';
import { headers } from 'next/headers';

export async function getT(ns?: string, options?: { keyPrefix: string }) {
  const headerList = await headers();
  const lng = headerList.get(headerName);

  if (lng && i18next.resolvedLanguage !== lng) {
    await i18next.changeLanguage(lng);
  }

  if (ns && !i18next.hasLoadedNamespace(ns)) {
    await i18next.loadNamespaces(ns);
  }

  return {
    t: i18next.getFixedT(
      lng ?? i18next.resolvedLanguage ?? '',
      Array.isArray(ns) ? ns[0] : ns,
      options?.keyPrefix,
    ),
    i18n: i18next,
  };
}
