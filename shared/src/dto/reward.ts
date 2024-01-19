import { z } from 'zod';
import {
  createRewardDtoSchema,
  updateRewardDtoSchema
} from '../schema/reward';
import { Reward } from '@prisma/client';

export type UpdateRewardDto = z.infer<typeof updateRewardDtoSchema>;

export type CreateRewardDto = z.infer<typeof createRewardDtoSchema>;

export type RewardEntity = Reward;
