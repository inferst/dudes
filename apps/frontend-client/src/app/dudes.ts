import { Container } from 'pixi.js';
import { assetsLoader } from '../assets/assetsLoader';
import { dudesManager } from './dudesManager';
import { Dude } from './entities/Dude';
import { timers } from '../helpers/timer';

export class Dudes {
  public stage: Container = new Container();
  public dudes: Record<string, Dude> = {};

  public async init(): Promise<void> {
    await assetsLoader.load();

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
}

export const dudes = new Dudes();
