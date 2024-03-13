import { Connection } from '@app/frontend-client/connection/connection';
import { Dudes } from '@lib/dudes';
import { SettingsEntity } from '@lib/types';
import { manifest } from '../assets/manifest';
import { Debug } from '../debug/debug';

export class App {
  private connection = new Connection();

  public settings: SettingsEntity = {};

  public async init(): Promise<void> {
    const dudes = new Dudes(document.body);
    await dudes.run({
      manifest,
      sound: { jump: '/client/sounds/jump.mp3' },
      settings: {},
    });

    if (import.meta.env.DEV) {
      new Debug(dudes);
    }

    this.connection.init();

    this.connection.onSettings((data) => this.handleSettings(data));

    this.connection.onMessage((data) => dudes.processMessage(data));
    this.connection.onAction((data) => dudes.processAction(data));
    this.connection.onChatters((data) => dudes.processChatters(data));
    this.connection.onRaid((data) => dudes.processRaid(data));
  }

  private handleSettings(data: SettingsEntity) {
    this.settings = data;
  }
}

export const app = new App();
