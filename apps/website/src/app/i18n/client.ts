'use client';

import { FlatNamespace, KeyPrefix } from 'i18next';
import i18next from './i18next';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  FallbackNs,
  useTranslation,
  UseTranslationOptions,
} from 'react-i18next';

export type $Tuple<T> = readonly [T?, ...T[]];

export function useT<
  Ns extends FlatNamespace | $Tuple<FlatNamespace> | undefined = undefined,
  KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined,
>(ns?: string, options?: UseTranslationOptions<KPrefix>) {
  const lng = useParams()?.lng;

  if (typeof lng !== 'string')
    throw new Error('useT is only available inside /app/[lng]');

  const [activeLng, setActiveLng] = useState(i18next.resolvedLanguage);

  useEffect(() => {
    if (activeLng === i18next.resolvedLanguage) return;
    setActiveLng(i18next.resolvedLanguage);
  }, [activeLng]);

  useEffect(() => {
    if (!lng || i18next.resolvedLanguage === lng) return;
    i18next.changeLanguage(lng);
  }, [lng]);

  return useTranslation(ns, options);
}
