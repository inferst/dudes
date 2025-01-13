import { useAuth } from '@app/frontend-admin/components/Auth/use-auth';
import { Button } from '../../ui/button';
import { AlertTriangle, Copy, CopyCheck } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../../ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { useTranslation } from 'react-i18next';

export function PreviewPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isChecked, setIsChecked] = useState(false);

  const handleCopyClick = () => {
    if (user?.previewUrl) {
      navigator.clipboard.writeText(user?.previewUrl);
      setIsChecked(true);

      toast({
        title: t('PreviewPage.copiedToClipboard', {
          defaultValue: 'Copied to clipboard',
        }),
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t('PreviewPage.title', { defaultValue: 'Preview' })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <div className="rounded-tl-md rounded-bl-md border p-2">
            <div className="blur-sm">{user?.previewUrl}</div>
          </div>
          <Button
            onClick={handleCopyClick}
            className="rounded-tl-none rounded-bl-none"
          >
            {isChecked ? <CopyCheck></CopyCheck> : <Copy></Copy>}
          </Button>
        </div>
        <div className="mt-4 flex">
          <AlertTriangle className="mr-2"></AlertTriangle>{' '}
          {t('PreviewPage.warningLinkText', {
            defaultValue: "Don't show the link anyone",
          })}
        </div>
      </CardContent>
    </Card>
  );
}
