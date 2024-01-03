import { Container, utils } from 'pixi.js';
import { assetsLoader } from '../assets/assetsLoader';
import {
  Connection,
  Message,
} from '@app/frontend-client/connection/connection';
import { Dude } from './entities/Dude';
import { config } from '@app/frontend-client/config/config';
import tinycolor from 'tinycolor2';

export class World {
  private connection = new Connection();

  public static stage: Container = new Container();
  public static dudes: utils.Dict<Dude> = {};

  public async init(): Promise<void> {
    await assetsLoader.load();

    this.connection.init();
    this.connection.onMessage((data) => this.handleMessage(data));

    World.stage.sortableChildren = true;
  }

  public update(): void {
    for (const id in World.dudes) {
      World.dudes[id].update();

      if (World.dudes[id].shouldBeDeleted) {
        this.deleteDude(id, World.dudes[id]);
      }
    }
  }

  private handleMessage(data: Message): void {
    if (!World.dudes[data.userId]) {
      const chatter = config.chatters[data.name];
      const dude = new Dude(data.name, chatter);
      this.addDude(data.userId, dude);
    }

    const dude = World.dudes[data.userId];

    const message = data.message;
    const array = message.split(' ').filter((item) => item != '');
    const command = array[0];
    const value = array[1];

    switch (command) {
      case '!jump':
        dude.jump();
        break;
      case '!color':
        // eslint-disable-next-line no-case-declarations
        const color = tinycolor(value);

        if (color && color.isValid()) {
          dude.tint(data.color, value);
        }
        break;
      default:
        if (data.message) {
          dude.addMessage(data.message);
        }

        if (data.emotes.length > 0) {
          dude.spitEmotes(data.emotes);
        }
    }

    if (data.color) {
      dude.tint(data.color);
    }
  }

  public addDude(id: string, dude: Dude): void {
    World.dudes[id] = dude;
    World.stage.addChild(dude.view);
  }

  public deleteDude(id: string, dude: Dude): void {
    delete World.dudes[id];
    World.stage.removeChild(dude.view);
  }
}
