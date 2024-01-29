import { AuthUserProps } from '@app/backend-api/auth/services/auth.service';
import { TWITCH_PLATFORM_ID } from '@app/backend-api/constants';
import { PrismaService } from '@app/backend-api/database/prisma.service';
import { Inject, Injectable } from '@nestjs/common';
import {
  CreateTwitchRewardDto,
  TwitchRewardEntity,
  UpdateTwitchRewardDto,
} from '@shared';
import { TwitchAuthProvider } from '../api-clients/twitch-api-client/twitch-auth-provider';

// TODO: handle prisma errors

@Injectable()
export class TwitchRewardRepository {
  public constructor(
    private readonly prismaService: PrismaService,
    @Inject('TWITCH_AUTH_PROVIDER') private readonly twitchAuthProvider: TwitchAuthProvider,
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

    await this.twitchAuthProvider.addUserForToken(user.userId);

    const twitchCustomRewards =
      await this.twitchAuthProvider.apiClient.channelPoints.getCustomRewards(
        user.platformUserId
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
        isActive: twitchCustomReward.isEnabled,
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
    const reward = await this.prismaService.reward.update({
      where: {
        id: rewardId,
        userId: user.userId,
        platformId: TWITCH_PLATFORM_ID,
      },
      data: {
        data: data.data,
      },
    });

    if (!reward) {
      throw new Error("Reward doesn't exist");
    }

    await this.twitchAuthProvider.addUserForToken(user.userId);

    const twitchCustomReward = await this.twitchAuthProvider.apiClient.channelPoints.updateCustomReward(
      user.platformUserId,
      reward.platformRewardId,
      {
        title: data.title,
        cost: data.cost,
        isEnabled: data.isActive,
      }
    );

    return {
      ...reward,
      isDeleted: false,
      isActive: twitchCustomReward.isEnabled,
      title: twitchCustomReward.title,
      cost: twitchCustomReward.cost,
    };
  }

  public async create(
    user: AuthUserProps,
    data: CreateTwitchRewardDto
  ): Promise<TwitchRewardEntity> {
    await this.twitchAuthProvider.addUserForToken(user.userId);

    const twitchCustomReward = await this.twitchAuthProvider.apiClient.channelPoints.createCustomReward(
      user.platformUserId,
      {
        title: data.title,
        cost: data.cost,
        isEnabled: data.isActive ?? true,
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
        data: data.data,
      },
    });

    return {
      ...reward,
      isDeleted: false,
      isActive: twitchCustomReward.isEnabled,
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

    await this.twitchAuthProvider.addUserForToken(user.userId);

    await this.twitchAuthProvider.apiClient.channelPoints.deleteCustomReward(
      user.platformUserId,
      reward.platformRewardId
    );
  }
}
