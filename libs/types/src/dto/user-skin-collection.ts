import { z } from 'zod';
import { updateUserSkinCollectionDtoSchema } from '..';

export type UserSkinCollectionEntity = {
  id: number;
  name: string;
  isActive: boolean;
};

export type UpdateUserSkinCollectionDto = z.infer<
  typeof updateUserSkinCollectionDtoSchema
>;
