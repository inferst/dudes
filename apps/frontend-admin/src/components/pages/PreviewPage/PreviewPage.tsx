import { useAuth } from '@app/frontend-admin/components/Auth/useAuth';
import { Button } from '../../ui/button';
import { AlertTriangle, Copy, CopyCheck } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../../ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';

export function PreviewPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isChecked, setIsChecked] = useState(false);

  const handleCopyClick = () => {
    if (user?.personalUrl) {
      navigator.clipboard.writeText(user?.personalUrl);
      setIsChecked(true);

      toast({
        title: 'Copied to clipboard',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <div className="rounded-tl-md rounded-bl-md border p-2">
            <div className="blur-sm">{user?.personalUrl}</div>
          </div>
          <Button
            onClick={handleCopyClick}
            className="rounded-tl-none rounded-bl-none"
          >
            {isChecked ? <CopyCheck></CopyCheck> : <Copy></Copy>}
          </Button>
        </div>
        <div className="mt-4 flex">
          <AlertTriangle className="mr-2"></AlertTriangle> Don't show the link
          anyone
        </div>
      </CardContent>
    </Card>
  );
}
