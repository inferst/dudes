import { Connection } from '@app/frontend-client/connection/connection';
import { Evotars } from 'evotars';
import { Debug } from '../debug/debug';
import { getGuid } from '../utils/utils';

const apiUrl = import.meta.env.VITE_API_URL;

export class App {
  private connection = new Connection();

  public async init(): Promise<void> {
    const guid = getGuid();
    const evotars = new Evotars(document.body, {
      font: '/static/fonts/Rubik-VariableFont_wght.ttf',
      sounds: { jump: { src: '/static/sounds/jump.mp3' } },
      assets: {
        poof: '/static/poof.json',
        rip1: '/static/rip1.png',
        rip2: '/static/rip2.png',
        skull: '/static/skull.png',
        weight: '/static/weight.png',
      },
      spriteLoaderFn: async (name: string) => {
        try {
          const data = await fetch(apiUrl + '/admin/sprite/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
              sprite: name,
              guid: guid,
            }),
          });

          return await data.json();
        } catch (e) {
          return;
        }
      },
    });

    await evotars.run();

    if (import.meta.env.DEV) {
      new Debug(evotars);
    }

    this.connection.init();

    this.connection.onSettings((data) => {
      evotars.updateSettings({
        fallingEvotars: data.fallingDudes,
        fallingRaiders: data.fallingRaiders,
        showAnonymousEvotars: data.showAnonymousDudes,
      });
    });

    this.connection.onMessage((data) => evotars.processMessage(data));
    this.connection.onAction((data) => evotars.processAction(data));
    this.connection.onChatters((data) => evotars.processChatters(data));
    this.connection.onRaid((data) => evotars.processRaid(data));
  }
}

export const app = new App();
