import { z } from 'zod';

const id = z.number().int().min(1);

const chatterName = z.string().min(1).max(255);

const sprite = z.string().min(1).max(255);

export const updateChatterDtoSchema = z.object({
  id,
  chatterName: chatterName,
  sprite: sprite,
}).strict();

export const createChatterDtoSchema = z.object({
  chatterName: chatterName,
  sprite: sprite,
}).strict();

export const createChatterFormSchema = z.object({
  chatterName: chatterName,
  sprite: sprite,
});

export type CreateChatterForm = z.infer<typeof createChatterFormSchema>;
