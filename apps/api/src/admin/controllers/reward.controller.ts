import { Auth } from '@/auth/decorators';
import { AuthGuard } from '@/auth/guards';
import { AuthUserProps } from '@/auth/services/auth.service';
import { ZodPipe } from '@/pipes/zod.pipe';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  CreateTwitchRewardDto,
  TwitchRewardEntity,
  UpdateTwitchRewardDto,
  createTwitchRewardDtoSchema,
  updateTwitchRewardDtoSchema,
} from '@repo/types';
import { TwitchRewardRepository } from '../repositories/twitch-reward.repository';

@Controller('/reward')
export class RewardController {
  public constructor(
    private readonly rewardRepository: TwitchRewardRepository,
  ) {}

  @Get('/twitch/list')
  @UseGuards(AuthGuard)
  public async getRewards(
    @Auth() user: AuthUserProps,
  ): Promise<TwitchRewardEntity[]> {
    return this.rewardRepository.getRewards(user);
  }

  @Put('/twitch/:id')
  @UseGuards(AuthGuard)
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Auth() user: AuthUserProps,
    @Body(new ZodPipe(updateTwitchRewardDtoSchema))
    reward: UpdateTwitchRewardDto,
  ): Promise<TwitchRewardEntity> {
    return this.rewardRepository.update(user, id, reward);
  }

  @Delete('/twitch/:id')
  @UseGuards(AuthGuard)
  public async delete(
    @Param('id', ParseIntPipe) id: number,
    @Auth() user: AuthUserProps,
  ): Promise<void> {
    await this.rewardRepository.delete(user, id);
  }

  @Post('/twitch')
  @UseGuards(AuthGuard)
  public async create(
    @Body(new ZodPipe(createTwitchRewardDtoSchema)) data: CreateTwitchRewardDto,
    @Auth() user: AuthUserProps,
  ): Promise<TwitchRewardEntity> {
    return this.rewardRepository.create(user, data);
  }
}
