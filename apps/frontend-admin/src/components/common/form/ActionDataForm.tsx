import {
  ActionEntity,
  isColorUserActionEntity,
  isDashUserActionEntity,
  isGrowUserActionEntity,
  isJumpUserActionEntity,
} from '@lib/types';
import { UseFormReturn } from 'react-hook-form';
import { ColorActionDataForm } from './ColorActionDataForm';
import { DashActionDataForm } from './DashActionDataForm';
import { GrowActionDataForm } from './GrowActionDataForm';
import { JumpActionDataForm } from './JumpActionDataForm';

export type ActionDataInput = { data: PrismaJson.ActionableData };

export type ActionDataFormProps = {
  action: ActionEntity;
  form: UseFormReturn<ActionDataInput>;
};

export function ActionDataForm(props: ActionDataFormProps) {
  const { action, form } = props;

  if (isGrowUserActionEntity(action)) {
    return <GrowActionDataForm form={form} />;
  }

  if (isColorUserActionEntity(action)) {
    return <ColorActionDataForm form={form} />;
  }

  if (isJumpUserActionEntity(action)) {
    return <JumpActionDataForm form={form} />;
  }

  if (isDashUserActionEntity(action)) {
    return <DashActionDataForm form={form} />;
  }

  return;
}
