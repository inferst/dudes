import { z } from 'zod';

const id = z.number().int().min(1);

const actionId = z.number().int().min(1);

const title = z.string().min(1).max(255);

const cost = z.number().int().min(1);

const isActive = z.boolean().optional();

const data = z.any();

export const updateTwitchRewardDtoSchema = z
  .object({
    id,
    isActive,
    title: title.optional(),
    cost: cost.optional(),
    data: data.optional(),
  })
  .strict();

export const createTwitchRewardDtoSchema = z
  .object({
    actionId,
    title,
    cost,
    isActive,
    data,
  })
  .strict();

export const updateTwitchRewardFormSchema = z.object({
  title,
  cost,
});

export const createTwitchRewardFormSchema = createTwitchRewardDtoSchema;

export type UpdateTwitchRewardForm = z.infer<
  typeof updateTwitchRewardFormSchema
>;
