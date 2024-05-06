import { Auth } from '@app/backend-api/auth/decorators';
import { AuthGuard } from '@app/backend-api/auth/guards';
import { AuthUserProps } from '@app/backend-api/auth/services/auth.service';
import { ZodPipe } from '@app/backend-api/pipes/zod.pipe';
import {
  ChatterEntity,
  CreateChatterDto,
  UpdateChatterDto,
  createChatterDtoSchema,
  updateChatterDtoSchema,
} from '@lib/types';
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
import { Prisma } from '@prisma/client';
import { ChatterRepository } from '../repositories/chatter.repository';
import { TWITCH_PLATFORM_ID } from '@app/backend-api/constants';

@Controller('/chatter')
export class ChatterController {
  public constructor(private readonly chatterRepository: ChatterRepository) {}

  @Get('/list')
  @UseGuards(AuthGuard)
  public async getChatters(
    @Auth() user: AuthUserProps
  ): Promise<ChatterEntity[]> {
    return this.chatterRepository.getChattersByUserId(user.userId);
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Auth() user: AuthUserProps,
    @Body(new ZodPipe(updateChatterDtoSchema)) chatter: UpdateChatterDto
  ): Promise<ChatterEntity> {
    return this.chatterRepository.update(user.userId, id, chatter);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  public async delete(
    @Param('id', ParseIntPipe) id: number,
    @Auth() user: AuthUserProps
  ): Promise<ChatterEntity> {
    return this.chatterRepository.delete(user.userId, id);
  }

  @Post()
  @UseGuards(AuthGuard)
  public async create(
    @Body(new ZodPipe(createChatterDtoSchema)) data: CreateChatterDto,
    @Auth() user: AuthUserProps
  ): Promise<ChatterEntity> {
    const chatter: Prisma.ChatterCreateInput = {
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
      chatterId: data.chatterId,
      sprite: data.sprite,
    };

    return this.chatterRepository.create(chatter);
  }
}
