import { Action } from '@prisma/client';
import { UserInfo } from './user';

export type ActionEntity = Action;

export type UserActionEntity = {
  userId: string;
  cooldown: number;
  info: UserInfo;
} & ActionEntity;

export type JumpUserActionEntity = {
  name: 'jump',
  data: {
    velocityX: number,
    velocityY: number,
  }
} & UserActionEntity;

export type ColorUserActionEntity = {
  name: 'color',
  data: {
    color: string;
  };
} & UserActionEntity;

export type GrowUserActionEntity = {
  name: 'grow',
  data: {
    duration: number,
    scale: number;
  };
} & UserActionEntity;

export const isJumpUserActionEntity = (
  entity: ActionEntity
): entity is JumpUserActionEntity => entity.name == 'jump';

export const isColorUserActionEntity = (
  entity: ActionEntity
): entity is ColorUserActionEntity => entity.name == 'color';

export const isGrowUserActionEntity = (
  entity: ActionEntity
): entity is GrowUserActionEntity => entity.name == 'grow';
