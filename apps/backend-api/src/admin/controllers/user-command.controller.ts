import { Auth } from '@app/backend-api/auth/decorators';
import { AuthGuard } from '@app/backend-api/auth/guards';
import { AuthUserProps } from '@app/backend-api/auth/services/auth.service';
import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { CommandRepository } from '../repositories/user-command.repository';
import { UserCommandEntity, UpdateUserCommandDto, updateUserCommandDtoSchema } from '@shared';
import { ZodPipe } from '@app/backend-api/pipes/zod.pipe';

@Controller('/command')
export class CommandController {
  public constructor(private readonly commandRepository: CommandRepository) {}

  @Get('/list')
  @UseGuards(AuthGuard)
  public async getCommands(
    @Auth() user: AuthUserProps
  ): Promise<UserCommandEntity[]> {
    return this.commandRepository.getComomandsByUserId(user.userId);
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  public async update(
    @Param() params: { id: number },
    @Body(new ZodPipe(updateUserCommandDtoSchema)) command: UpdateUserCommandDto
  ): Promise<UserCommandEntity> {
    const id = Number(params.id);
    return this.commandRepository.patch(id, command);
  }
}
