export type UserEntity = {
  name: string;
  picture: string;
  twitchId: string;
  userId: number;
  guid: string;
  personalUrl: string;
};

export type UserCommandEntity = {
  id: number;
  isActive: boolean;
  text: string;
  cooldown: number;
};
