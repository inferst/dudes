import { AuthGuard } from '@app/backend-api/auth/guards';
import {
  Controller,
  Get,
  UseGuards
} from '@nestjs/common';
import {
  ActionEntity
} from '@lib/types';
import { ActionRepository } from '../repositories/action.repository';

@Controller('/action')
export class ActionController {
  public constructor(private readonly actionRepository: ActionRepository) {}

  @Get('/list')
  @UseGuards(AuthGuard)
  public async getActions(): Promise<ActionEntity[]> {
    return this.actionRepository.getActions();
  }
}
