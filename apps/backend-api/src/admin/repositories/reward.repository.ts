import { PrismaService } from '@app/backend-api/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, Reward } from '@prisma/client';

@Injectable()
export class RewardRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async getRewardsByUserId(userId: number): Promise<Reward[]> {
    return this.prismaService.reward.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  public async update(
    userId: number,
    rewardId: number,
    data: Prisma.RewardUpdateInput
  ): Promise<Reward> {
    return this.prismaService.reward.update({
      data,
      where: {
        user: {
          id: userId,
        },
        id: rewardId,
      },
    });
  }

  public async create(data: Prisma.RewardCreateInput): Promise<Reward> {
    return this.prismaService.reward.create({
      data,
    });
  }

  public async delete(userId: number, rewardId: number): Promise<Reward> {
    return this.prismaService.reward.delete({
      where: {
        id: rewardId,
        user: {
          id: userId,
        },
      },
    });
  }
}
