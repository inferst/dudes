import { Auth } from '@app/backend-api/auth/decorators';
import { AuthGuard } from '@app/backend-api/auth/guards';
import { AuthUserProps } from '@app/backend-api/auth/services/auth.service';
import { ZodPipe } from '@app/backend-api/pipes/zod.pipe';
import { Body, Controller, Get, Param, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { UpdateCommandDto, CommandEntity, updateCommandDtoSchema } from '@shared';
import { UserCommandRepository } from '../repositories/user-command.repository';

@Controller('/command')
export class UserCommandController {
  public constructor(private readonly commandRepository: UserCommandRepository) {}

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
    return this.commandRepository.update(user.userId, id, command);
  }
}
