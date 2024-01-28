import { ZodObject, ZodRawShape, z } from 'zod';
import {
  ActionEntity,
  isColorUserActionEntity,
  isGrowUserActionEntity,
} from '../dto';

export const colorActionData = {
  data: z.union([
    z.object({
      action: z.object({
        color: z.string().optional(),
      }),
    }),
    z.object({
      // TODO: Implement arguments option in user interface
      arguments: z.array(z.literal('color')).max(1),
    }),
  ]),
};

export const growActionData = {
  data: z.object({
    action: z.object({
      duration: z.number().int().min(0).max(999999).optional(),
      scale: z.number().int().min(1).max(10).optional(),
    }),
  }),
};

export const getActionableEntityFormSchema = (
  action: ActionEntity,
  schema: ZodObject<ZodRawShape>
) => {
  if (isColorUserActionEntity(action)) {
    return schema.extend(colorActionData);
  }

  if (isGrowUserActionEntity(action)) {
    return schema.extend(growActionData);
  }

  return schema;
};
