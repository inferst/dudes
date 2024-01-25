import { AuthUserProps } from '@app/backend-api/auth/services/auth.service';
import { TWITCH_PLATFORM_ID } from '@app/backend-api/constants';
import { PrismaService } from '@app/backend-api/database/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  CreateTwitchRewardDto,
  TwitchRewardEntity,
  UpdateTwitchRewardDto,
} from '@shared';
import { TwitchApiClientFactory } from '../api-clients/twitch-api-client';

// TODO: handle prisma errors

@Injectable()
export class TwitchRewardRepository {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly twitchApiClientFactory: TwitchApiClientFactory
  ) {}

  public async getRewards(user: AuthUserProps): Promise<TwitchRewardEntity[]> {
    const rewards = await this.prismaService.reward.findMany({
      where: {
        userId: user.userId,
        platformId: TWITCH_PLATFORM_ID,
      },
      orderBy: {
        id: 'asc',
      },
    });

    const twitchApiClient = await this.twitchApiClientFactory.createFromUserId(
      user.userId
    );

    const twitchCustomRewards = await twitchApiClient.getCustomRewards(
      user.twitchId
    );

    return rewards.map((reward) => {
      const twitchCustomReward = twitchCustomRewards.find(
        (customReward) => customReward.id == reward.platformRewardId
      );

      if (!twitchCustomReward) {
        return { ...reward, isDeleted: true, isActive: false };
      }

      return {
        ...reward,
        isDeleted: false,
        isActive: twitchCustomReward.is_enabled,
        title: twitchCustomReward.title,
        cost: twitchCustomReward.cost,
      };
    });
  }

  public async update(
    user: AuthUserProps,
    rewardId: number,
    data: UpdateTwitchRewardDto
  ): Promise<TwitchRewardEntity> {
    const reward = await this.prismaService.reward.findFirst({
      where: {
        id: rewardId,
        userId: user.userId,
        platformId: TWITCH_PLATFORM_ID,
      },
    });

    if (!reward) {
      throw new Error("Reward doesn't exist");
    }

    const twitchApiClient = await this.twitchApiClientFactory.createFromUserId(
      user.userId
    );

    const twitchCustomReward = await twitchApiClient.updateCustomReward(
      user.twitchId,
      reward.platformRewardId,
      {
        title: data.title,
        cost: data.cost,
        is_enabled: data.isActive,
      }
    );

    return {
      ...reward,
      isDeleted: false,
      isActive: twitchCustomReward.is_enabled,
      title: twitchCustomReward.title,
      cost: twitchCustomReward.cost,
    };
  }

  public async create(
    user: AuthUserProps,
    data: CreateTwitchRewardDto
  ): Promise<TwitchRewardEntity> {
    const twitchApiClient = await this.twitchApiClientFactory.createFromUserId(
      user.userId
    );

    const twitchCustomReward = await twitchApiClient.createCustomReward(
      user.twitchId,
      {
        title: data.title,
        cost: data.cost,
        is_enabled: data.isActive ?? true,
      }
    );

    const reward = await this.prismaService.reward.create({
      data: {
        action: {
          connect: {
            id: data.actionId,
          },
        },
        user: {
          connect: {
            id: user.userId,
          },
        },
        platform: {
          connect: {
            id: TWITCH_PLATFORM_ID,
          },
        },
        platformRewardId: twitchCustomReward.id,
      },
    });

    return {
      ...reward,
      isDeleted: false,
      isActive: twitchCustomReward.is_enabled,
      title: twitchCustomReward.title,
      cost: twitchCustomReward.cost,
    };
  }

  public async delete(user: AuthUserProps, rewardId: number): Promise<void> {
    const reward = await this.prismaService.reward.delete({
      where: {
        id: rewardId,
        user: {
          id: user.userId,
        },
      },
    });

    const twitchApiClient = await this.twitchApiClientFactory.createFromUserId(
      user.userId
    );

    await twitchApiClient.deleteCustomReward(
      user.twitchId,
      reward.platformRewardId
    );
  }
}
