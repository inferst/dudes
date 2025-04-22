import { Chatter } from '@repo/database';
import { z } from 'zod';
import { createChatterDtoSchema, updateChatterDtoSchema } from '../schema';

export type TwitchChatterEntity = {
  userId: string;
  name: string;
};

export type UpdateChatterDto = z.infer<typeof updateChatterDtoSchema>;

export type CreateChatterDto = z.infer<typeof createChatterDtoSchema>;

export type ChatterEntity = Chatter;
