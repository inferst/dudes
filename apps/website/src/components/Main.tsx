import Link from 'next/link';
import { DudesWrapper } from './DudesWrapper';
import { getT } from '@/app/i18n';

export const Main = async () => {
  const { t } = await getT('common');

  return (
    <div className="flex justify-center">
      <div className="container">
        <div className="m-6 flex justify-center">
          <Link
            href="/"
            className="flex items-center rounded-md px-2 pt-1 pb-2 bg-primary text-primary-foreground text-6xl font-medium"
          >
            <span className="block">D</span>
            <span className="block text-4xl">U</span>
            <span className="block">D</span>
            <span className="block text-4xl">E</span>
            <span className="block">S</span>
          </Link>
        </div>
        <div className="text-2xl text-center m-4">{t('mainTitle')}</div>
        <div className="flex justify-center">
          <DudesWrapper />
        </div>
        <div className="m-6 text-2xl flex items-center justify-center">
          <a className="block bg-[#772ce8] p-4 rounded-sm" href="/api/auth/login">
            {t('twitchLoginButtonText')}
          </a>
        </div>
      </div>
    </div>
  );
};
