import {
  CreateRewardDto,
  RewardEntity,
  UpdateRewardDto,
  UpdateCommandDto,
  CommandEntity,
  UserEntity,
} from '@shared';
import axios, { GenericAbortSignal } from 'axios';

export type WithSignal = {
  signal?: GenericAbortSignal;
};

export const appAxios = axios.create({
  baseURL: '/api',
});

export const api = {
  getUser: async ({ signal }: WithSignal): Promise<UserEntity> => {
    const { data } = await appAxios.get('/admin/user', {
      signal,
    });

    return data;
  },
  getRewards: async ({ signal }: WithSignal): Promise<RewardEntity[]> => {
    const { data } = await appAxios.get('/admin/reward/list', {
      signal,
    });

    return data;
  },
  updateReward: async (reward: UpdateRewardDto): Promise<RewardEntity> => {
    const { data } = await appAxios.put('/admin/reward/' + reward.id, reward);

    return data;
  },
  createReward: async (reward: CreateRewardDto): Promise<RewardEntity> => {
    const { data } = await appAxios.post('/admin/reward/', reward);

    return data;
  },
  getCommands: async ({ signal }: WithSignal): Promise<CommandEntity[]> => {
    const { data } = await appAxios.get(
      '/admin/command/list',
      {
        signal,
      }
    );

    return data;
  },
  updateCommand: async (
    command: UpdateCommandDto
  ): Promise<CommandEntity> => {
    const { data } = await appAxios.put('/admin/command/' + command.id, command);

    return data;
  },
};
