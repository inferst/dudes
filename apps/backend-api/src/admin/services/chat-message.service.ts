import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatMessageService {
  public isUserCommand(message: string): boolean {
    return message.startsWith('!');
  }

  public stripEmotes(message: string, emotes: string[]): string {
    return message
      .split(' ')
      .filter((word) => !emotes.includes(word))
      .join(' ');
  }

  public formatMessage(message: string): string {
    if (this.isUserCommand(message)) {
      return '';
    }

    return message.trim();
  }
}
