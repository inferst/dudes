import { z } from 'zod';
import { UpdateSettingsDto } from '../dto/settings';

export const updateSettingsDtoSchema = z.object({
  showAnonymousDudes: z.boolean().default(false).optional(),
  fallingDudes: z.boolean().default(true).optional(),
  fallingRaiders: z.boolean().default(false).optional(),
  hiddenUsers: z.string().default("").optional(),
}).strict();

export const defaultSettingsValues: UpdateSettingsDto = {
  showAnonymousDudes: false,
  fallingDudes: true,
  fallingRaiders: false,
  hiddenUsers: "",
};

export type UpdateSettingsForm = UpdateSettingsDto;
