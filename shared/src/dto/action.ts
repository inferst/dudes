import { Action } from '@prisma/client';

export type ActionEntity = Action;

export type UserActionEntity = {
  userId: string;
} & ActionEntity;

export type ColorUserActionEntity = {
  data: {
    color: string;
  };
} & UserActionEntity;

export const isJumpUserActionEntity = (
  entity: UserActionEntity
): entity is ColorUserActionEntity => entity.name == 'jump';

export const isColorUserActionEntity = (
  entity: UserActionEntity
): entity is ColorUserActionEntity => entity.name == 'color';
