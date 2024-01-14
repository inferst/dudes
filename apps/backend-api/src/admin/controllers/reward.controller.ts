import { Auth } from '@app/backend-api/auth/decorators';
import { AuthGuard } from '@app/backend-api/auth/guards';
import { AuthUserProps } from '@app/backend-api/auth/services/auth.service';
import { ZodPipe } from '@app/backend-api/pipes/zod.pipe';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  CreateRewardDto,
  RewardEntity,
  UpdateRewardDto,
  createRewardDtoSchema,
  updateRewardDtoSchema,
} from '@shared';
import { RewardRepository } from '../repositories/reward.repository';

@Controller('/reward')
export class RewardController {
  public constructor(private readonly rewardRepository: RewardRepository) {}

  @Get('/list')
  @UseGuards(AuthGuard)
  public async getRewards(
    @Auth() user: AuthUserProps
  ): Promise<RewardEntity[]> {
    return this.rewardRepository.getRewardsByUserId(user.userId);
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Auth() user: AuthUserProps,
    @Body(new ZodPipe(updateRewardDtoSchema)) reward: UpdateRewardDto
  ): Promise<RewardEntity> {
    return this.rewardRepository.update(user.userId, id, reward);
  }

  @Post()
  @UseGuards(AuthGuard)
  public async create(
    @Body(new ZodPipe(createRewardDtoSchema)) reward: CreateRewardDto,
    @Auth() user: AuthUserProps
  ): Promise<RewardEntity> {
    const command: Prisma.RewardCreateInput = {
      user: {
        connect: {
          id: user.userId,
        },
      },
      action: {
        connect: {
          id: reward.actionId,
        },
      },
      title: reward.title,
      description: reward.description,
      cooldown: reward.cooldown,
      cost: reward.cost,
    };

    return this.rewardRepository.create(command);
  }
}
