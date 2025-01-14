import { z } from 'zod';
import { updateUserSkinDtoSchema } from '..';

export type UserSkinEntity = {
  id: number;
  name: string;
  isActive: boolean;
  isDefault: boolean;
};

export type UpdateUserSkinDto = z.infer<typeof updateUserSkinDtoSchema>;
