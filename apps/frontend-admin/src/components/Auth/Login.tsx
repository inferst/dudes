import { Button } from '@app/frontend-admin/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@app/frontend-admin/components/ui/card';

export function Login() {
  return (
    <div>
      <div className="flex items-center justify-center h-[100vh] w-">
        <Card>
          <CardHeader>
            <CardTitle>{'Welcome to Dudes Admin Panel'}</CardTitle>
            <CardDescription>
              {'The way to manage your stream dudes.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full bg-[#9147ff] text-white hover:bg-[#772ce8]"
              asChild
            >
              <a href="/api/auth/login" target="_blank">
                {'Twitch Login'}
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
