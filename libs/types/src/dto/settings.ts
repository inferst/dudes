import { Settings } from '@prisma/client';
import { z } from 'zod';
import { updateSettingsDtoSchema } from '../schema/settings';

export type UpdateSettingsDto = z.infer<typeof updateSettingsDtoSchema>;

export type SettingsEntity = Settings['data'];
