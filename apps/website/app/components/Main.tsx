import { useTranslation } from 'react-i18next';
// import { DudesWrapper } from './DudesWrapper';

export const Main = () => {
  const { t } = useTranslation();

  return (
    <div className="container">
      <div className="m-6 flex justify-center">
        <a
          href="/"
          className="flex items-center rounded-md px-2 pt-1 pb-2 bg-primary text-primary-foreground text-6xl font-medium"
        >
          <span className="block">D</span>
          <span className="block text-4xl">U</span>
          <span className="block">D</span>
          <span className="block text-4xl">E</span>
          <span className="block">S</span>
        </a>
      </div>
      <div className="text-2xl text-center m-4">{t('mainTitle')}</div>
      <div className="border border-border/60 bg-slate-900"></div>
      <div className="m-6 text-2xl flex items-center justify-center">
        <a className="block bg-[#772ce8] p-4 rounded-sm" href="/api/auth/login">
          {t('twitchLoginButtonText')}
        </a>
      </div>
    </div>
  );
};
