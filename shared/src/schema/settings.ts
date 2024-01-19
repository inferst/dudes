import { z } from 'zod';
import { UpdateSettingsDto } from '../dto/settings';

export const updateSettingsDtoSchema = z.object({
  showAnonymousDudes: z.boolean().default(false).optional(),
  fallingDudes: z.boolean().default(true).optional(),
});

export const defaultSettingsValues: UpdateSettingsDto = {
  showAnonymousDudes: false,
  fallingDudes: true,
};

export type UpdateSettingsForm = UpdateSettingsDto;
