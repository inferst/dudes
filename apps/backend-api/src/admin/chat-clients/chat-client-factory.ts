import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { ChatterEntity, MessageEntity } from '@shared';
import { TwitchChatClientFactory } from './twitch-chat-client.factory';

export type ChatClient = {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  onChat: (listener: (data: MessageEntity) => void) => void;
  onChatters: (listener: (data: ChatterEntity[]) => void) => void;
};

@Injectable()
export class ChatClientFactory {
  public constructor(
    private readonly twitchChatClientFactory: TwitchChatClientFactory,
  ) {}

  // TODO: create YoutubeChatClientFactory
  public async createFromUser(user: User): Promise<ChatClient> {
    return this.twitchChatClientFactory.createFromUser(user);
  }
}
