import { z } from 'zod';

const id = z.number().int().min(1);

const actionId = z.number().int().min(0);

const text = z.string().min(1).max(255);

const cooldown = z.number().int().min(0);

const isActive = z.boolean().optional();

const data = z.any();

export const updateCommandDtoSchema = z.object({
  id,
  isActive,
  text: text.optional(),
  cooldown: cooldown.optional(),
  data: data.optional(),
});

export const createCommandDtoSchema = z.object({
  actionId,
  isActive,
  text,
  cooldown,
  data,
});

export const updateCommandFormSchema = z.object({
  text,
  cooldown,
});

export type UpdateCommandForm = z.infer<typeof updateCommandFormSchema>;
