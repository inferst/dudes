import { Inject, Injectable } from '@nestjs/common';
import {
  ActionEntity,
  MessageEntity,
  RewardRedemptionData,
  UserActionEntity,
} from '@lib/types';
import { ActionRepository } from '../repositories/action.repository';
import { CommandRepository } from '../repositories/command.repository';
import { TwitchRewardRepository } from '../repositories/twitch-reward.repository';
import { TwitchClientFactory } from '../twitch/twitch-client.factory';

type CooldownStorage = {
  [id: string]: NodeJS.Timeout;
};

@Injectable()
export class ActionService {
  private actions: ActionEntity[] = [];

  private commandCooldownStorage: CooldownStorage = {};

  public constructor(
    private readonly commandRepository: CommandRepository,
    private readonly actionRepository: ActionRepository,
    private readonly twitchRewardRepository: TwitchRewardRepository,
    @Inject('TWITCH_CLIENT_FACTORY')
    private readonly twitchClientFactory: TwitchClientFactory
  ) {}

  public async getUserActionByMessage(
    userId: number,
    message: MessageEntity
  ): Promise<UserActionEntity | undefined> {
    if (this.actions.length == 0) {
      this.actions = await this.actionRepository.getActions();
    }

    const commands = await this.commandRepository.getActiveCommandsByUserId(
      userId
    );

    const command = commands.find((command) =>
      message.message.includes(command.text)
    );

    if (!command) {
      return;
    }

    const action = this.actions.find((action) => action.id == command.actionId);

    if (!action) {
      return;
    }

    const cooldownId = `${userId}_${message.userId}_${command.id}`;

    console.log(this.commandCooldownStorage);

    if (this.commandCooldownStorage[cooldownId]) {
      return;
    } else {
      this.commandCooldownStorage[cooldownId] = setTimeout(() => {
        delete this.commandCooldownStorage[cooldownId];
      }, command.cooldown * 1000);
    }

    let data = { ...action.data, ...command.data.action };

    if (command.data.arguments && command.data.arguments.length > 0) {
      const argsMessage = message.message.split(command.text)[1];
      const args = argsMessage.split(' ').filter((arg) => arg);

      const entries = command.data.arguments
        .map((argument, i) => [argument, args[i]])
        .filter((item) => item[1]);

      data = { ...Object.fromEntries(entries) };
    }

    return {
      userId: message.userId,
      cooldown: command.cooldown,
      ...action,
      data: { ...action.data, ...data },
      info: message.info,
    };
  }

  public async getUserActionByReward(
    userId: number,
    platformUserId: string,
    redemption: RewardRedemptionData
  ): Promise<UserActionEntity | undefined> {
    if (this.actions.length == 0) {
      this.actions = await this.actionRepository.getActions();
    }

    const apiClient = await this.twitchClientFactory.createApiClient(userId);

    const redemptionUserColor = await apiClient.chat.getColorForUser(
      redemption.userId
    );

    const twitchReward = await this.twitchRewardRepository.getRewardById(
      userId,
      platformUserId,
      redemption.rewardId
    );

    if (!twitchReward) {
      return;
    }

    const action = this.actions.find(
      (action) => action.id == twitchReward.actionId
    );

    if (!action) {
      return;
    }

    let data = { ...action.data, ...twitchReward.data.action };

    if (twitchReward.data.arguments && twitchReward.data.arguments.length > 0) {
      const args = redemption.input.split(' ').filter((arg) => arg);

      const entries = twitchReward.data.arguments
        .map((argument, i) => [argument, args[i]])
        .filter((item) => item[1]);

      data = { ...Object.fromEntries(entries) };
    }

    return {
      userId: redemption.userId,
      cooldown: 0,
      ...action,
      data: { ...action.data, ...data },
      info: {
        displayName: redemption.userDisplayName,
        color: redemptionUserColor ?? undefined,
      },
    };
  }
}
