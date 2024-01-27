import {
  ActionEntity,
  TwitchRewardEntity,
  isColorUserActionEntity,
  isGrowUserActionEntity,
  isJumpUserActionEntity,
} from '@shared';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { ErrorMessage } from '@hookform/error-message';
import { UseFormReturn } from 'react-hook-form';

export type RewardActionDataInput = { data: TwitchRewardEntity['data'] };

export type RewardActionDataFormProps = {
  action: ActionEntity;
  form: UseFormReturn<RewardActionDataInput>;
};

export function RewardActionDataForm(props: RewardActionDataFormProps) {
  const { action, form } = props;

  if (isGrowUserActionEntity(action)) {
    return (
      <>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="reward-duration" className="text-right">
            Duration
          </Label>
          <Input
            id="reward-duration"
            className="col-span-3"
            {...form.register('data.action.duration', {
              setValueAs: (value) => (value === '' ? undefined : parseInt(value, 10)),
            })}
          />
          <ErrorMessage
            errors={form.formState.errors}
            name="data.action.duration"
            render={({ message }) => (
              <p className="col-start-2 col-span-3 text-sm mb-2 text-destructive">
                {message}
              </p>
            )}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="reward-scale" className="text-right">
            Scale
          </Label>
          <Input
            id="reward-scale"
            className="col-span-3"
            {...form.register('data.action.scale', {
              setValueAs: (value) =>
                value === '' ? undefined : parseInt(value, 10),
            })}
          />
          <ErrorMessage
            errors={form.formState.errors}
            name="data.action.scale"
            render={({ message }) => (
              <p className="col-start-2 col-span-3 text-sm mb-2 text-destructive">
                {message}
              </p>
            )}
          />
        </div>
      </>
    );
  }

  if (isJumpUserActionEntity(action)) {
    return;
  }

  if (isColorUserActionEntity(action)) {
    return (
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="reward-color" className="text-right">
          Color
        </Label>
        <Input
          id="reward-color"
          className="col-span-3"
          {...form.register('data.action.color')}
        />
        <ErrorMessage
          errors={form.formState.errors}
          name="data.action.color"
          render={({ message }) => (
            <p className="col-start-2 col-span-3 text-sm mb-2 text-destructive">
              {message}
            </p>
          )}
        />
      </div>
    );
  }

  return;
}
