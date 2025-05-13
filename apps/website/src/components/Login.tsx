import { getT } from '@/lib/i18n';
import Image from 'next/image';

export const Login = async () => {
  const { t } = await getT('common');

  return (
    <>
      <a
        className="block text-2xl shadow-2xl shadow-gray-900 bg-purple-800 py-4 px-8 rounded-2xl text-gray-100 transition duration-500 ease-in-out transform hover:bg-purple-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
        href="/api/auth/login"
      >
        <Image
          src="/twitch.svg"
          alt="Github logo"
          width={30}
          height={30}
          priority
          className="inline dark:invert mr-4"
        />
        {t('login.button')}
      </a>
    </>
  );
};
