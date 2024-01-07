import { z } from 'zod';

export const updateUserCommandDtoSchema = z.object({
  id: z.number().int().min(1),
  isActive: z.boolean().optional(),
  text: z.string().min(1).max(255).optional(),
  cooldown: z.number().int().optional(),
});

export const updateUserCommandFormSchema = updateUserCommandDtoSchema.omit({
  id: true,
});

export type UpdateUserCommandDto = z.infer<typeof updateUserCommandDtoSchema>;

export type UpdateUserCommandForm = z.infer<typeof updateUserCommandFormSchema>;
