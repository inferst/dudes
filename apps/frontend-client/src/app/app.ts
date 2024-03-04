import { Connection } from '@app/frontend-client/connection/connection';
import { SettingsEntity } from '@lib/types';
import { Container } from 'pixi.js';
import { assetsLoader } from '../assets/assetsLoader';
import { dudesManager } from './dudesManager';
import { Dude } from './entities/Dude';
import { timers } from '../helpers/timer';

export class App {
  private connection = new Connection();

  public stage: Container = new Container();
  public dudes: Record<string, Dude> = {};

  public chatterIds: string[] = [];

  public settings: SettingsEntity = {};

  public async init(): Promise<void> {
    await assetsLoader.load();

    this.connection.init();

    this.connection.onSettings((data) => this.handleSettings(data));
    this.connection.onMessage((data) => dudesManager.processMessage(data));
    this.connection.onAction((data) => dudesManager.processAction(data));
    this.connection.onChatters((data) => dudesManager.processChatters(data));
    this.connection.onRaid((data) => dudesManager.processRaid(data));

    this.stage.sortableChildren = true;

    dudesManager.subscribe({
      onAdd: (dude: Dude) => this.stage.addChild(dude.container),
      onDelete: (dude: Dude) => this.stage.removeChild(dude.container),
    });
  }

  public update(): void {
    timers.tick();
    dudesManager.update();
  }

  private handleSettings(data: SettingsEntity) {
    this.settings = data;
  }
}

export const app = new App();
