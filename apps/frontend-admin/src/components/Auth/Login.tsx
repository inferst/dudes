import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

export function Login() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center h-screen">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {t('Login.title', {
              defaultValue: 'Dudes Admin',
            })}
          </CardTitle>
          <CardDescription>
            {t('Login.description', {
              defaultValue: 'The way to manage your stream dudes.',
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full bg-[#9147ff] text-white hover:bg-[#772ce8]"
            asChild
          >
            <a href="/api/auth/login">
              {t('Login.loginButtonText', {
                defaultValue: 'Twitch Login',
              })}
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
