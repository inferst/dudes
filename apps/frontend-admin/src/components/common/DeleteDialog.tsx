import { useTranslation } from 'react-i18next';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';

export type DeleteDialogProps = {
  onDelete: () => void;
};

export function DeleteDialog(props: DeleteDialogProps) {
  const { onDelete } = props;
  const { t } = useTranslation();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          {t('DeleteDialog.deleteButtonText', {
            defaultValue: 'Delete',
          })}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('DeleteDialog.title', {
              defaultValue: 'Are you absolutely sure?',
            })}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('DeleteDialog.description', {
              defaultValue:
                'This action cannot be undone. This will permanently delete item.',
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {t('DeleteDialog.cancelButtonText', {
              defaultValue: 'Cancel',
            })}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>
            {t('DeleteDialog.deleteButtonText', {
              defaultValue: 'Delete',
            })}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
