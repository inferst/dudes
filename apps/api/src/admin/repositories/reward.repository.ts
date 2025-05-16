import { PrismaService } from '@/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, Reward } from '@repo/database';

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
    data: Prisma.RewardUpdateInput,
  ): Promise<Reward> {
    return this.prismaService.reward.update({
      data,
      where: {
        id: rewardId,
        user: {
          id: userId,
        },
      },
    });
  }

  public async create(data: Prisma.RewardCreateInput): Promise<Reward> {
    return this.prismaService.reward.create({
      data,
    });
  }

  public async delete(userId: number, id: number): Promise<Reward> {
    return this.prismaService.reward.delete({
      where: {
        id,
        user: {
          id: userId,
        },
      },
    });
  }
}
