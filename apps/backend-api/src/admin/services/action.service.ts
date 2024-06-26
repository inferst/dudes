import { Inject, Injectable } from '@nestjs/common';
import tinycolor from 'tinycolor2';
import {
  ActionEntity,
  RewardRedemptionData,
  UserActionEntity,
  UserInfo,
  isColorUserActionEntity,
  isSpriteUserActionEntity,
} from '@lib/types';
import { ActionRepository } from '../repositories/action.repository';
import { CommandRepository } from '../repositories/command.repository';
import { TwitchRewardRepository } from '../repositories/twitch-reward.repository';
import { TwitchClientFactory } from '../twitch/twitch-client.factory';
import { SpriteService } from './sprite.service';
import { ChatterService } from './chatter.service';
import { Command } from '@prisma/client';

type CooldownStorage = {
  [id: string]: NodeJS.Timeout;
};

@Injectable()
export class ActionService {
  private actions: ActionEntity[] = [];

  private commandCooldownStorage: CooldownStorage = {};

  public constructor(
    private readonly spriteService: SpriteService,
    private readonly chatterService: ChatterService,
    private readonly commandRepository: CommandRepository,
    private readonly actionRepository: ActionRepository,
    private readonly twitchRewardRepository: TwitchRewardRepository,
    @Inject('TWITCH_CLIENT_FACTORY')
    private readonly twitchClientFactory: TwitchClientFactory
  ) {}

  private async getCommandByMessage(
    userId: number,
    message: string
  ): Promise<Command | undefined> {
    const commands = await this.commandRepository.getActiveCommandsByUserId(
      userId
    );

    const commandText = message.trim().split(' ')[0];

    const command = commands.find((command) => command.text == commandText);

    if (!command) {
      return;
    }

    return command;
  }

  private async getActionById(
    actionId: number
  ): Promise<ActionEntity | undefined> {
    if (this.actions.length == 0) {
      this.actions = await this.actionRepository.getActions();
    }

    const action = this.actions.find((action) => action.id == actionId);

    if (!action) {
      return;
    }

    return action;
  }

  private processCooldown(
    userId: number,
    messageUserId: string,
    command: Command
  ): boolean {
    const cooldownId = `${userId}_${messageUserId}_${command.id}`;

    if (this.commandCooldownStorage[cooldownId]) {
      return true;
    } else {
      this.commandCooldownStorage[cooldownId] = setTimeout(() => {
        delete this.commandCooldownStorage[cooldownId];
      }, command.cooldown * 1000);
    }

    return false;
  }

  private async collectUserInfo(
    userAction: UserActionEntity,
    userId: number,
    chatterId: string
  ): Promise<UserInfo> {
    const chatter = await this.chatterService.getChatter(userId, chatterId);

    // TODO: check that chatter data doesn't overwrite default user info
    // if there is no values in chatter data
    let userInfo = {
      ...userAction.info,
      sprite: chatter.sprite,
      color: chatter.color,
    };

    if (isColorUserActionEntity(userAction)) {
      const info = { ...userInfo, color: userAction.data.color };
      await this.chatterService.updateChatter(userId, chatterId, info);

      return info;
    } else if (isSpriteUserActionEntity(userAction)) {
      const info = { ...userInfo, sprite: userAction.data.sprite };
      await this.chatterService.updateChatter(userId, chatterId, info);

      return info;
    }

    return userInfo;
  }

  private mergeUserDefaultUserAction(
    action: UserActionEntity
  ): UserActionEntity {
    if (isColorUserActionEntity(action)) {
      const defaultValues = this.getDefaultColorActionValues();
      const color = defaultValues.includes(action.data.color)
        ? action.info.color
        : action.data.color;

      return {
        ...action,
        data: {
          ...action.data,
          color,
        },
      };
    }

    return action;
  }

  private async collectUserAction(
    userId: number,
    action: ActionEntity,
    actionableData: PrismaJson.ActionableData,
    chatterId: string,
    defaultInfo: UserInfo,
    argsText: string | undefined
  ): Promise<UserActionEntity> {
    const hasArguments =
      actionableData.arguments &&
      actionableData.arguments.length > 0 &&
      argsText;

    const data = hasArguments
      ? this.getArgumentsFromText(actionableData.arguments, argsText.trim())
      : { ...actionableData.action };

    const actionData = { ...action.data, ...data };

    const userActionWithDefaultUserInfo = {
      ...action,
      userId: chatterId,
      data: actionData,
      info: defaultInfo,
    };

    const userActionWithUserDefaultData = this.mergeUserDefaultUserAction(
      userActionWithDefaultUserInfo
    );

    // TODO: format color and sprite action to info
    // probably it's better to place it in socket receiver
    const userInfo = await this.collectUserInfo(
      userActionWithUserDefaultData,
      userId,
      chatterId
    );

    return {
      ...userActionWithUserDefaultData,
      info: userInfo,
    };
  }

  public async getUserActionByMessage(
    userId: number,
    message: string,
    messageUserId: string,
    info: UserInfo
  ): Promise<UserActionEntity | undefined> {
    const command = await this.getCommandByMessage(userId, message);

    if (!command) {
      return;
    }

    const action = await this.getActionById(command.id);

    if (!action) {
      return;
    }

    if (this.processCooldown(userId, messageUserId, command)) {
      return;
    }

    const argsText = message.split(command.text)[1];

    const collectedUserAction = await this.collectUserAction(
      userId,
      action,
      command.data,
      messageUserId,
      info,
      argsText
    );

    if (!(await this.isUserActionValid(userId, collectedUserAction))) {
      return;
    }

    return collectedUserAction;
  }

  public async getUserActionByReward(
    userId: number,
    platformUserId: string,
    redemption: RewardRedemptionData
  ): Promise<UserActionEntity | undefined> {
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

    const action = await this.getActionById(twitchReward.actionId);

    if (!action) {
      return;
    }

    const argsText = redemption.input;

    const info = {
      displayName: redemption.userDisplayName,
      sprite: 'default',
      color: redemptionUserColor ?? undefined,
    };

    const collectedUserAction = await this.collectUserAction(
      userId,
      action,
      twitchReward.data,
      redemption.userId,
      info,
      argsText
    );

    if (!(await this.isUserActionValid(userId, collectedUserAction))) {
      return;
    }

    return collectedUserAction;
  }

  private getDefaultColorActionValues(): string[] {
    return ['', 'default', 'reset'];
  }

  private getArgumentsFromText(
    args: string[],
    text: string
  ): Record<string, string> {
    if (args.length == 0) {
      return {};
    } else if (args.length == 1) {
      return {
        [args[0]]: text,
      };
    } else {
      const textArgs = text.split(' ').filter((arg) => arg.trim());
      const entries = args
        .map((argument, i) => [argument, textArgs[i]])
        .filter((arg) => arg[1]);

      return { ...Object.fromEntries(entries) };
    }
  }

  private async isUserActionValid(
    userId: number,
    action: ActionEntity
  ): Promise<boolean> {
    if (isSpriteUserActionEntity(action)) {
      return this.spriteService.isSpriteAvailable(userId, action.data.sprite);
    }

    if (isColorUserActionEntity(action)) {
      return tinycolor(action.data.color).isValid();
    }

    return true;
  }
}
