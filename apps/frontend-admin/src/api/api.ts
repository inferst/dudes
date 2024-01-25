import {
  CreateRewardDto,
  RewardEntity,
  UpdateRewardDto,
  UpdateCommandDto,
  CommandEntity,
  UserEntity,
  ActionEntity,
  CreateCommandDto,
  SettingsEntity,
  UpdateSettingsDto,
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
  deleteReward: async (id: number): Promise<RewardEntity> => {
    const { data } = await appAxios.delete('/admin/reward/' + id);

    return data;
  },
  getCommands: async ({ signal }: WithSignal): Promise<CommandEntity[]> => {
    const { data } = await appAxios.get('/admin/command/list', {
      signal,
    });

    return data;
  },
  createCommand: async (command: CreateCommandDto): Promise<CommandEntity> => {
    const { data } = await appAxios.post('/admin/command/', command);

    return data;
  },
  deleteCommand: async (id: number): Promise<CommandEntity> => {
    const { data } = await appAxios.delete('/admin/command/' + id);

    return data;
  },
  updateCommand: async (command: UpdateCommandDto): Promise<CommandEntity> => {
    const { data } = await appAxios.put(
      '/admin/command/' + command.id,
      command
    );

    return data;
  },
  getActions: async ({ signal }: WithSignal): Promise<ActionEntity[]> => {
    const { data } = await appAxios.get('/admin/action/list', {
      signal,
    });

    return data;
  },
  getSettings: async ({ signal }: WithSignal): Promise<SettingsEntity> => {
    const { data } = await appAxios.get('/admin/settings', {
      signal,
    });

    return data;
  },
  updateSettings: async (
    settings: UpdateSettingsDto
  ): Promise<SettingsEntity> => {
    const { data } = await appAxios.put('/admin/settings/', settings);

    return data;
  },
};