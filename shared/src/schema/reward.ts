import { z } from 'zod';
import {
  ActionEntity,
  isColorUserActionEntity,
  isGrowUserActionEntity,
} from '../dto';

const title = z.string().min(1).max(255);

const cost = z.number().int().min(1);

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

export const updateTwitchRewardDtoSchema = z.object({
  id: z.number().int().min(1),
  title: title.optional(),
  cost: cost.optional(),
  data: z.any(),
  isActive: z.boolean().optional(),
});

export const createTwitchRewardDtoSchema = z.object({
  actionId: z.number().int().min(1),
  title: title,
  cost: cost,
  data: z.any(),
  isActive: z.boolean().optional(),
});

export const updateTwitchRewardFormSchema = z.object({
  title: title,
  cost: cost,
});

export const getUpdateTwitchRewardFormSchema = (action: ActionEntity) => {
  if (isColorUserActionEntity(action)) {
    return updateTwitchRewardFormSchema.extend(color);
  }

  if (isGrowUserActionEntity(action)) {
    return updateTwitchRewardFormSchema.extend(grow);
  }

  return updateTwitchRewardFormSchema;
};

export const getCreateTwitchRewardFormSchema = (action: ActionEntity) => {
  if (isColorUserActionEntity(action)) {
    return createTwitchRewardFormSchema.extend(color);
  }

  if (isGrowUserActionEntity(action)) {
    return createTwitchRewardFormSchema.extend(grow);
  }

  return createTwitchRewardFormSchema;
};

export const createTwitchRewardFormSchema = createTwitchRewardDtoSchema;

export type UpdateTwitchRewardForm = z.infer<
  typeof updateTwitchRewardFormSchema
>;
