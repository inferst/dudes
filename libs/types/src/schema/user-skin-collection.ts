import { z } from 'zod';

export const updateUserSkinCollectionDtoSchema = z
  .object({
    isActive: z.boolean(),
  })
  .strict();
