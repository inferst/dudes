import { config } from '@app/frontend-client/config/config';
import { Connection } from '@app/frontend-client/connection/connection';
import { SettingsEntity } from '@shared';
import { Container } from 'pixi.js';
import { MessageEntity } from 'shared/src/dto/socket/message';
import tinycolor from 'tinycolor2';
import { assetsLoader } from '../assets/assetsLoader';
import { Dude } from './entities/Dude';
import { ChatterEntity } from 'shared/src/dto/socket/chatters';

export class World {
  private static connection = new Connection();

  public static stage: Container = new Container();
  public static dudes: Record<string, Dude> = {};

  public static chatterIds: string[] = [];

  public static settings?: SettingsEntity;

  public static async init(): Promise<void> {
    await assetsLoader.load();

    this.connection.init();
    this.connection.onSettings((data) => this.handleSettings(data));
    this.connection.onMessage((data) => this.handleMessage(data));
    this.connection.onChatters((data) => this.handleChatters(data));

    World.stage.sortableChildren = true;
  }

  public static update(): void {
    for (const id in World.dudes) {
      World.dudes[id].update();

      if (World.dudes[id].shouldBeDeleted) {
        this.removeDude(id, World.dudes[id]);
      }
    }
  }

  private static handleSettings(data: SettingsEntity) {
    this.settings = data;
  }

  private static handleChatters(data: ChatterEntity[]) {
    if (this.settings?.showAnonymousDudes) {
      for (const chatter of data) {
        if (!World.dudes[chatter.userId]) {
          const dude = new Dude(chatter.name);
          dude.anonymous();
          dude.spawn();
          this.addDude(chatter.userId, dude);
        }
      }
    }

    for (const id in World.dudes) {
      if (!data.some((chatter) => chatter.userId == id)) {
        this.removeDude(id, World.dudes[id]);
      }
    }
  }

  private static handleMessage(data: MessageEntity): void {
    if (!World.dudes[data.userId]) {
      const chatter = config.chatters[data.name];
      const dude = new Dude(data.name, chatter);
      this.addDude(data.userId, dude);

      console.log(this.settings?.fallingDudes);

      const isFalling = this.settings?.fallingDudes
        ? this.chatterIds.every((id) => id != data.userId)
        : false;
      dude.spawn(isFalling);
    }

    if (this.chatterIds.every((id) => id != data.userId)) {
      this.chatterIds.push(data.userId);
    }

    const dude = World.dudes[data.userId];

    const message = data.message;
    const array = message.split(' ').filter((item: string) => item != '');
    const command = array[0];
    const value = array[1];

    switch (command) {
      case '!jump': {
        dude.jump();
        break;
      }
      case '!color': {
        const color = tinycolor(value);

        if (color && color.isValid()) {
          dude.tint(data.color, value);
        }
        break;
      }
      default: {
        if (data.message) {
          dude.addMessage(data.message);
        }

        if (data.emotes.length > 0) {
          dude.spitEmotes(data.emotes);
        }
      }
    }

    if (data.color) {
      dude.tint(data.color);
    }
  }

  public static addDude(id: string, dude: Dude): void {
    World.dudes[id] = dude;
    World.stage.addChild(dude.view);
  }

  public static removeDude(id: string, dude: Dude): void {
    delete World.dudes[id];
    World.stage.removeChild(dude.view);
  }
}
