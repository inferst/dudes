import { UserActionEntity } from './action';
import { SettingsEntity } from './settings';
import { ChatterEntity } from './chatter';
import { MessageEntity } from './message';
import { RaidData } from './event';

export type ServerToClientsEvents = {
  message: (data: MessageEntity) => void;
  settings: (data: SettingsEntity) => void;
  chatters: (data: ChatterEntity[]) => void;
  action: (data: UserActionEntity) => void;
  raid: (data: RaidData) => void;
};

export interface ClientToServerEvents {
  initialize: (data: { roomId: string }) => void;
}
