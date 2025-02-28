import { z } from 'zod';
import { updateUserSkinCollectionDtoSchema } from '..';

export type UserSkinCollectionEntity = {
  id: number;
  name: string;
  isActive: boolean;
  isDefault: boolean;
};

export type UpdateUserSkinCollectionDto = z.infer<
  typeof updateUserSkinCollectionDtoSchema
>;
