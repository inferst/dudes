import { Reward } from '@prisma/client';
import { z } from 'zod';
import { createTwitchRewardDtoSchema, updateTwitchRewardDtoSchema } from '../schema/reward';

export type UpdateTwitchRewardDto = z.infer<typeof updateTwitchRewardDtoSchema>;

export type CreateTwitchRewardDto = z.infer<typeof createTwitchRewardDtoSchema>;

export type RewardEntity = Reward;

export type TwitchRewardEntity = {
  title?: string;
  cost?: number;
  isDeleted: boolean;
  isActive: boolean;
} & RewardEntity;

export type RewardRedemptionEntity = {
  id: string;
  userId: string;
  input: string;
}
