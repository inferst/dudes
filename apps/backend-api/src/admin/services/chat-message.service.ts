import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatMessageService {
  public isUserCommand(message: string): boolean {
    return message.startsWith('!');
  }

  public stripEmotes(message: string, emotes: string[]): string {
    const formatted = emotes.reduce((result: string, emote: string) => {
      return result.replaceAll(emote, '');
    }, message);

    return formatted.replace(/\s+/g, ' ');
  }

  public formatMessage(message: string): string {
    if (this.isUserCommand(message)) {
      return '';
    }

    return message.trim();
  }
}
