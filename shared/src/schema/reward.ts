import { z } from 'zod';

export const updateRewardDtoSchema = z.object({
  id: z.number().int().min(1),
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(255).optional(),
  cost: z.number().int().min(0).optional(),
  cooldown: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  isPaused: z.boolean().optional(),
});

export const createRewardDtoSchema = z.object({
  actionId: z.number().int().min(1),
  title: z.string().min(1).max(255),
  description: z.string().max(255).optional(),
  cost: z.number().int().min(0),
  cooldown: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  isPaused: z.boolean().optional(),
});

export const updateRewardFormSchema = updateRewardDtoSchema.omit({
  id: true,
});

export type UpdateRewardForm = z.infer<typeof updateRewardFormSchema>;
