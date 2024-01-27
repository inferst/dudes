import { z } from 'zod';

const text = z.string().min(1).max(255);
const cooldown = z.number().int().min(0);

export const updateCommandDtoSchema = z.object({
  id: z.number().int().min(1),
  isActive: z.boolean().optional(),
  text: text.optional(),
  cooldown: cooldown.optional(),
});

export const createCommandDtoSchema = z.object({
  actionId: z.number().int().min(0),
  isActive: z.boolean().optional(),
  text: text,
  cooldown: cooldown,
});

export const updateCommandFormSchema = z.object({
  text: text,
  cooldown: cooldown,
});

export type UpdateCommandForm = z.infer<typeof updateCommandFormSchema>;
