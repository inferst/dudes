import { UserActionEntity } from '../action';
import { SettingsEntity } from '../settings';
import { ChatterEntity } from './chatters';
import { MessageEntity } from './message';

export type ServerToClientsEvents = {
  message: (data: MessageEntity) => void;
  settings: (data: SettingsEntity) => void;
  chatters: (data: ChatterEntity[]) => void;
  action: (data: UserActionEntity) => void;
};

export interface ClientToServerEvents {
  initialize: (data: { roomId: string }) => void;
}

export * from './message';
