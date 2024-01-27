import { z } from 'zod';

const title = z.string().min(1).max(255);
const cost = z.number().int().min(1);

export const updateTwitchRewardDtoSchema = z.object({
  id: z.number().int().min(1),
  title: title.optional(),
  cost: cost.optional(),
  isActive: z.boolean().optional(),
});

export const createTwitchRewardDtoSchema = z.object({
  actionId: z.number().int().min(1),
  title: title,
  cost: cost,
  isActive: z.boolean().optional(),
});

export const updateTwitchRewardFormSchema = z.object({
  title: title,
  cost: cost,
});

export const createTwitchRewardFormSchema = createTwitchRewardDtoSchema;

export type UpdateTwitchRewardForm = z.infer<
  typeof updateTwitchRewardFormSchema
>;
