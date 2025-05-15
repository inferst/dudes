import { z } from 'zod';
import { UpdateSettingsDto } from '../dto/settings';

export const updateSettingsDtoSchema = z.object({
  showAnonymousEvotars: z.boolean().default(false).optional(),
  fallingEvotars: z.boolean().default(true).optional(),
  fallingRaiders: z.boolean().default(false).optional(),
  hiddenUsers: z.string().default('').optional(),
  maxEvotars: z.number().max(1000).positive().default(100).optional(),
});

export const defaultSettingsValues: UpdateSettingsDto = {
  showAnonymousEvotars: false,
  fallingEvotars: true,
  fallingRaiders: false,
  hiddenUsers: '',
  maxEvotars: 100,
};

export type UpdateSettingsForm = UpdateSettingsDto;
