import { z } from 'zod';

const id = z.number().int().min(1);

const chatterId = z.string().min(1).max(255);

const sprite = z.string().min(1).max(255);

export const updateChatterDtoSchema = z
  .object({
    id,
    chatterId: chatterId,
    sprite: sprite,
  })
  .strict();

export const createChatterDtoSchema = z
  .object({
    chatterId: chatterId,
    sprite: sprite,
  })
  .strict();

export const createChatterFormSchema = z.object({
  chatterId: chatterId,
  sprite: sprite,
});

export type CreateChatterForm = z.infer<typeof createChatterFormSchema>;
