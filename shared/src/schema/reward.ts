import { z } from 'zod';

export const updateTwitchRewardDtoSchema = z.object({
  id: z.number().int().min(1),
  title: z.string().min(1).max(255).optional(),
  cost: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const createTwitchRewardDtoSchema = z.object({
  actionId: z.number().int().min(1),
  title: z.string().min(1).max(255),
  cost: z.number().int().min(0),
  isActive: z.boolean().optional(),
});

export const updateTwitchRewardFormSchema = updateTwitchRewardDtoSchema.omit({
  id: true,
});

export const createTwitchRewardFormSchema = createTwitchRewardDtoSchema;

export type UpdateTwitchRewardForm = z.infer<
  typeof updateTwitchRewardFormSchema
>;
