import { UserInfo } from './user';

export type MessageEntity = {
  userId: string;
  message: string;
  emotes: string[];
  info: UserInfo;
};
