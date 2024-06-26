import { Injectable } from '@nestjs/common';
import { ChatterRepository } from '../repositories/chatter.repository';
import { TWITCH_PLATFORM_ID } from '@app/backend-api/constants';
import { Chatter } from '@prisma/client';
import { UserInfo } from '@lib/types';

@Injectable()
export class ChatterService {
  constructor(private readonly chatterRepository: ChatterRepository) {}

  public async getChatter(userId: number, chatterId: string): Promise<Chatter> {
    let chatter = await this.chatterRepository.getChatterById(
      userId,
      chatterId
    );

    if (!chatter) {
      const data = {
        user: {
          connect: {
            id: userId,
          },
        },
        platform: {
          connect: {
            id: TWITCH_PLATFORM_ID,
          },
        },
        chatterId,
      };

      chatter = await this.chatterRepository.create(data);
    }

    return chatter;
  }

  public async updateChatter(
    userId: number,
    chatterId: string,
    info: UserInfo
  ): Promise<Chatter> {
    const chatter = await this.getChatter(userId, chatterId);

    return await this.chatterRepository.update(userId, chatter.id, {
      ...chatter,
      sprite: info.sprite,
      color: info.color,
    });
  }
}
