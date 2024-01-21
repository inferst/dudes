import { Injectable } from '@nestjs/common';
import { ActionEntity, UserActionEntity } from '@shared';
import { ActionRepository } from '../repositories/action.repository';
import { CommandRepository } from '../repositories/command.repository';

@Injectable()
export class ActionService {
  private actions: ActionEntity[] = [];

  public constructor(
    private readonly commandRepository: CommandRepository,
    private readonly actionRepository: ActionRepository
  ) {}

  public async getUserAction(
    userId: number,
    messageUserId: string,
    message: string
  ): Promise<UserActionEntity | undefined> {
    if (this.actions.length == 0) {
      this.actions = await this.actionRepository.getActions();
    }

    const commands = await this.commandRepository.getActiveCommandsByUserId(
      userId
    );

    const command = commands.find((command) => message.includes(command.text));

    if (!command) {
      return;
    }

    const action = this.actions.find((action) => action.id == command.actionId);

    if (!action) {
      return;
    }

    let data = {};

    if (command.data.arguments && command.data.arguments.length > 0) {
      const argsMessage = message.split(command.text)[1];
      const args = argsMessage.split(' ').filter((arg) => arg);

      const entries = command.data.arguments
        .map((argument, i) => [argument, args[i]])
        .filter((item) => item[1]);

      data = { ...command.data.action, ...Object.fromEntries(entries) };
    }

    return {
      userId: messageUserId,
      ...action,
      data: { ...action.data, ...data },
    };
  }
}
