import { Action } from '@prisma/client';

export type ActionEntity = Action;

export type UserActionEntity = {
  userId: string;
  cooldown: number;
} & ActionEntity;

export type ColorUserActionEntity = {
  data: {
    color: string;
  };
} & UserActionEntity;

export type GrowUserActionEntity = {
  data: {
    duration: number,
    scale: number;
  };
} & UserActionEntity;

export const isJumpUserActionEntity = (
  entity: UserActionEntity
): entity is UserActionEntity => entity.name == 'jump';

export const isColorUserActionEntity = (
  entity: UserActionEntity
): entity is ColorUserActionEntity => entity.name == 'color';

export const isGrowUserActionEntity = (
  entity: UserActionEntity
): entity is GrowUserActionEntity => entity.name == 'grow';
