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

export type UpdateCommandForm = z.infer<typeof updateCommandFormSchema>;
