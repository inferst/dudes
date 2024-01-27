import { z } from 'zod';
import {
  ActionEntity,
  isColorUserActionEntity,
  isGrowUserActionEntity,
} from '../dto';

const text = z.string().min(1).max(255);

const cooldown = z.number().int().min(0);

const color = {
  data: z.object({
    action: z.object({
      color: z.string().optional(),
    }),
  }),
};

const grow = {
  data: z.object({
    action: z.object({
      duration: z.number().int().min(0).max(999999).optional(),
      scale: z.number().int().min(1).max(10).optional(),
    }),
  }),
};

export const updateCommandDtoSchema = z.object({
  id: z.number().int().min(1),
  isActive: z.boolean().optional(),
  text: text.optional(),
  data: z.any(),
  cooldown: cooldown.optional(),
});

export const createCommandDtoSchema = z.object({
  actionId: z.number().int().min(0),
  isActive: z.boolean().optional(),
  text: text,
  data: z.any(),
  cooldown: cooldown,
});

export const updateCommandFormSchema = z.object({
  text: text,
  cooldown: cooldown,
});

export const getUpdateCommandFormSchema = (action: ActionEntity) => {
  if (isColorUserActionEntity(action)) {
    return updateCommandFormSchema.extend(color);
  }

  if (isGrowUserActionEntity(action)) {
    return updateCommandFormSchema.extend(grow);
  }

  return updateCommandFormSchema;
};

export type UpdateCommandForm = z.infer<typeof updateCommandFormSchema>;
