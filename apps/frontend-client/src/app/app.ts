import { Connection } from '@app/frontend-client/connection/connection';
import { Evotars } from 'evotars';
import { Debug } from '../debug/debug';

export class App {
  private connection = new Connection();

  public async init(): Promise<void> {
    const sounds = { jump: { src: '/client/sounds/jump.mp3' } };
    const dudes = new Evotars(document.body, {
      sounds,
      spriteLoaderFn: async (name: string) => {
        const path = '/client/evotars/' + name + '/';
        const sprite = await fetch(path + 'sprite.json');
        const spriteJson = await sprite.json();
        const data = await fetch(path + 'data.json');
        const dataJson = await data.json();

        return {
          data: dataJson,
          image: path + 'sprite.png',
          sprite: spriteJson,
        };
      },
    });

    await dudes.run();

    if (import.meta.env.DEV) {
      new Debug(dudes);
    }

    this.connection.init();

    this.connection.onSettings((data) => {
      dudes.updateSettings({
        fallingEvotars: data.fallingDudes,
        fallingRaiders: data.fallingRaiders,
        showAnonymousEvotars: data.showAnonymousDudes,
      });
    });

    this.connection.onMessage((data) => dudes.processMessage(data));
    this.connection.onAction((data) => dudes.processAction(data));
    this.connection.onChatters((data) => dudes.processChatters(data));
    this.connection.onRaid((data) => dudes.processRaid(data));
  }
}

export const app = new App();
