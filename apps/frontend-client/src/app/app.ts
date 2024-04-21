import { Connection } from '@app/frontend-client/connection/connection';
import { Evotars } from 'evotars';
import { manifest } from '../assets/manifest';
import { Debug } from '../debug/debug';

export class App {
  private connection = new Connection();

  public async init(): Promise<void> {
    const dudes = new Evotars(document.body);
    await dudes.run({
      manifest,
      sound: { jump: '/client/sounds/jump.mp3' },
    });

    if (import.meta.env.DEV) {
      new Debug(dudes);
    }

    this.connection.init();

    this.connection.onSettings((data) => {
      dudes.updateSettings(data);
    });

    this.connection.onMessage((data) => dudes.processMessage(data));
    this.connection.onAction((data) => dudes.processAction(data));
    this.connection.onChatters((data) => dudes.processChatters(data));
    this.connection.onRaid((data) => dudes.processRaid(data));
  }
}

export const app = new App();
