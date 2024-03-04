import {
  TwitchRewardEntity,
  UpdateCommandDto,
  CommandEntity,
  UserEntity,
  ActionEntity,
  CreateCommandDto,
  SettingsEntity,
  UpdateSettingsDto,
  UpdateTwitchRewardDto,
  CreateTwitchRewardDto,
} from '@lib/types';
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
  getRewards: async ({ signal }: WithSignal): Promise<TwitchRewardEntity[]> => {
    const { data } = await appAxios.get('/admin/reward/twitch/list', {
      signal,
    });

    return data;
  },
  updateReward: async (reward: UpdateTwitchRewardDto): Promise<TwitchRewardEntity> => {
    const { data } = await appAxios.put('/admin/reward/twitch/' + reward.id, reward);

    return data;
  },
  createReward: async (reward: CreateTwitchRewardDto): Promise<TwitchRewardEntity> => {
    const { data } = await appAxios.post('/admin/reward/twitch', reward);

    return data;
  },
  deleteReward: async (id: number): Promise<TwitchRewardEntity> => {
    const { data } = await appAxios.delete('/admin/reward/twitch/' + id);

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
