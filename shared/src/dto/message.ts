export type MessageEntity = {
  name: string;
  userId: string;
  message: string;
  emotes: string[];
  data: {
    color?: string;
  }
};
