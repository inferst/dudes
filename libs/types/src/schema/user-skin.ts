import { z } from 'zod';

export const updateUserSkinDtoSchema = z
  .object({
    isActive: z.boolean(),
  })
  .strict();
