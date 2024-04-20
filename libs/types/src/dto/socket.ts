import { UserActionEntity } from './action';
import { TwitchChatterEntity } from './chatter';
import { RaidData } from './event';
import { MessageEntity } from './message';
import { SettingsEntity } from './settings';

export type ServerToClientsEvents = {
  message: (data: MessageEntity) => void;
  settings: (data: SettingsEntity) => void;
  chatters: (data: TwitchChatterEntity[]) => void;
  action: (data: UserActionEntity) => void;
  raid: (data: RaidData) => void;
};

export interface ClientToServerEvents {
  initialize: (data: { roomId: string }) => void;
}
