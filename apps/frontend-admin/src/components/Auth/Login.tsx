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
    <div className="flex items-center justify-center h-screen">
      <Card>
        <CardHeader>
          <CardTitle className='text-center'>{'Dudes Admin'}</CardTitle>
          <CardDescription>
            {'The way to manage your stream dudes.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full bg-[#9147ff] text-white hover:bg-[#772ce8]"
            asChild
          >
            <a href="/api/auth/login">{'Twitch Login'}</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
