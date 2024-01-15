import { Auth } from '@app/backend-api/auth/decorators';
import { AuthGuard } from '@app/backend-api/auth/guards';
import { AuthUserProps } from '@app/backend-api/auth/services/auth.service';
import { ZodPipe } from '@app/backend-api/pipes/zod.pipe';
import { Body, Controller, Get, Param, ParseIntPipe, Put, UseGuards, Post } from '@nestjs/common';
import { UpdateCommandDto, CommandEntity, updateCommandDtoSchema, createCommandDtoSchema, CreateCommandDto } from '@shared';
import { CommandRepository } from '../repositories/command.repository';
import { Prisma } from '@prisma/client';

@Controller('/command')
export class CommandController {
  public constructor(private readonly commandRepository: CommandRepository) {}

  @Get('/list')
  @UseGuards(AuthGuard)
  public async getCommands(
    @Auth() user: AuthUserProps
  ): Promise<CommandEntity[]> {
    return this.commandRepository.getComomandsByUserId(user.userId);
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Auth() user: AuthUserProps,
    @Body(new ZodPipe(updateCommandDtoSchema)) command: UpdateCommandDto
  ): Promise<CommandEntity> {
    return this.commandRepository.update(id, command);
  }

  @Post()
  @UseGuards(AuthGuard)
  public async create(
    @Body(new ZodPipe(createCommandDtoSchema)) data: CreateCommandDto,
    @Auth() user: AuthUserProps
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
