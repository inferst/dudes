import { z } from 'zod';

export const updateCommandDtoSchema = z.object({
  id: z.number().int().min(1),
  isActive: z.boolean().optional(),
  text: z.string().min(1).max(255).optional(),
  cooldown: z.number().int().min(0).optional(),
});

export const createCommandDtoSchema = z.object({
  actionId: z.number().int().min(0),
  isActive: z.boolean().optional(),
  text: z.string().min(1).max(255),
  cooldown: z.number().int().min(0).optional(),
});

export const updateCommandFormSchema = updateCommandDtoSchema.omit({
  id: true,
});

export const updateRewardDtoSchema = z.object({
  id: z.number().int().min(1),
  title: z.string().min(1).max(255).optional(),
  description: z.string().min(1).max(255).optional(),
  cost: z.number().int().min(0).optional(),
  cooldown: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  isPaused: z.boolean().optional(),
});

export const createRewardDtoSchema = z.object({
  actionId: z.number().int().min(1),
  title: z.string().min(1).max(255),
  description: z.string().min(1).max(255).optional(),
  cost: z.number().int().min(0),
  cooldown: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  isPaused: z.boolean().optional(),
});

export const updateRewardFormSchema = updateRewardDtoSchema.omit({
  id: true,
});

export type UpdateCommandDto = z.infer<typeof updateCommandDtoSchema>;

export type CreateCommandDto = z.infer<typeof createCommandDtoSchema>;

export type UpdateCommandForm = z.infer<typeof updateCommandFormSchema>;

export type UpdateRewardDto = z.infer<typeof updateRewardDtoSchema>;

export type CreateRewardDto = z.infer<typeof createRewardDtoSchema>;

export type UpdateRewardForm = z.infer<typeof updateRewardFormSchema>;
