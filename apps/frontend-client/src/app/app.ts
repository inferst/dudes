import { config } from '@app/frontend-client/config/config';
import { Connection } from '@app/frontend-client/connection/connection';
import {
  SettingsEntity,
  UserActionEntity,
  isColorUserActionEntity,
  isJumpUserActionEntity,
} from '@shared';
import { Container } from 'pixi.js';
import { ChatterEntity } from 'shared/src/dto/socket/chatters';
import { MessageEntity } from 'shared/src/dto/socket/message';
import tinycolor, { ColorInput } from 'tinycolor2';
import { assetsLoader } from '../assets/assetsLoader';
import { Dude, DudeProps } from './entities/Dude';

export class App {
  private connection = new Connection();

  public stage: Container = new Container();
  public dudes: Record<string, Dude> = {};

  public chatterIds: string[] = [];

  public settings?: SettingsEntity;

  public async init(): Promise<void> {
    await assetsLoader.load();

    this.connection.init();

    this.connection.onSettings((data) => this.handleSettings(data));
    this.connection.onMessage((data) => this.handleMessage(data));
    this.connection.onAction((data) => this.handleAction(data));
    this.connection.onChatters((data) => this.handleChatters(data));

    this.stage.sortableChildren = true;
  }

  public update(): void {
    for (const id in this.dudes) {
      this.dudes[id].update();
    }
  }

  private handleSettings(data: SettingsEntity) {
    this.settings = data;
  }

  private handleChatters(data: ChatterEntity[]) {
    if (this.settings?.showAnonymousDudes) {
      for (const chatter of data) {
        if (!this.dudes[chatter.userId]) {
          const dude = new Dude({
            name: chatter.name,
            isAnonymous: !this.hasMessages(chatter.userId),
          });
          dude.spawn();

          this.addDude(chatter.userId, dude);
        }
      }
    }

    for (const id in this.dudes) {
      if (!data.some((chatter) => chatter.userId == id)) {
        const dude = this.dudes[id];
        dude.fade(() => {
          this.removeDude(id, dude);
        });
      }
    }
  }

  private hasMessages = (userId: string) =>
    this.chatterIds.every((id) => id != userId);

  private handleAction(action: UserActionEntity): void {
    const dude = this.dudes[action.userId];

    if (isJumpUserActionEntity(action)) {
      dude.jump();
    } else if (isColorUserActionEntity(action)) {
      const color = tinycolor(action.data.color as ColorInput);

      if (color && color.isValid()) {
        dude.setUserProps({ color: action.data.color });
      }
    }
  }

  private handleMessage(data: MessageEntity): void {
    if (!this.dudes[data.userId]) {
      const isFalling = this.settings?.fallingDudes
        ? this.hasMessages(data.userId)
        : false;

      const props: DudeProps = { name: data.name };
      const sprite = config.chatters[data.name];

      if (sprite) {
        props.sprite = sprite;
      }

      const dude = new Dude(props);
      dude.spawn(isFalling);

      this.addDude(data.userId, dude);
    }

    if (this.hasMessages(data.userId)) {
      this.chatterIds.push(data.userId);
    }

    const dude = this.dudes[data.userId];

    if (data.message) {
      dude.addMessage(data.message);
    }

    if (data.emotes.length > 0) {
      dude.spitEmotes(data.emotes);
    }

    if (data.color) {
      dude.setProps({ color: data.color });
    }
  }

  public addDude(id: string, dude: Dude): void {
    this.dudes[id] = dude;
    this.stage.addChild(dude.container);
  }

  public removeDude(id: string, dude: Dude): void {
    delete this.dudes[id];
    this.stage.removeChild(dude.container);
  }

  public zIndexDudeMax(from: number) {
    return Object.values(this.dudes).reduce((zIndex, dude) => {
      return zIndex <= dude.container.zIndex
        ? dude.container.zIndex + 1
        : zIndex;
    }, from);
  }

  public zIndexDudeMin(from: number) {
    return Object.values(this.dudes).reduce((zIndex, dude) => {
      return zIndex >= dude.container.zIndex
        ? dude.container.zIndex - 1
        : zIndex;
    }, from);
  }
}

export const app = new App();
