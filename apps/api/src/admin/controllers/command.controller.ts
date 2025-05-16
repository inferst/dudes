import { Auth } from '@/auth/decorators';
import { AuthGuard } from '@/auth/guards';
import { AuthUserProps } from '@/auth/services/auth.service';
import { ZodPipe } from '@/pipes/zod.pipe';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
  Post,
  Delete,
} from '@nestjs/common';
import {
  UpdateCommandDto,
  CommandEntity,
  updateCommandDtoSchema,
  createCommandDtoSchema,
  CreateCommandDto,
} from '@repo/types';
import { CommandRepository } from '../repositories/command.repository';
import { Prisma } from '@repo/database';

@Controller('/command')
export class CommandController {
  public constructor(private readonly commandRepository: CommandRepository) {}

  @Get('/list')
  @UseGuards(AuthGuard)
  public async getCommands(
    @Auth() user: AuthUserProps,
  ): Promise<CommandEntity[]> {
    return this.commandRepository.getCommandsByUserId(user.userId);
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Auth() user: AuthUserProps,
    @Body(new ZodPipe(updateCommandDtoSchema)) command: UpdateCommandDto,
  ): Promise<CommandEntity> {
    return this.commandRepository.update(user.userId, id, command);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  public async delete(
    @Param('id', ParseIntPipe) id: number,
    @Auth() user: AuthUserProps,
  ): Promise<CommandEntity> {
    return this.commandRepository.delete(user.userId, id);
  }

  @Post()
  @UseGuards(AuthGuard)
  public async create(
    @Body(new ZodPipe(createCommandDtoSchema)) data: CreateCommandDto,
    @Auth() user: AuthUserProps,
  ): Promise<CommandEntity> {
    const command: Prisma.CommandCreateInput = {
      user: {
        connect: {
          id: user.userId,
        },
      },
      action: {
        connect: {
          id: data.actionId,
        },
      },
      text: data.text,
      cooldown: data.cooldown,
    };

    return this.commandRepository.create(command);
  }
}
