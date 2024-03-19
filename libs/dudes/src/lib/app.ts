import { SettingsEntity } from '@lib/types';
import * as PIXI from 'pixi.js';
import { assetsLoader } from './services/assetsLoader';
import { dudesManager } from './services/dudesManager';
import { Dude } from './entities/Dude';
import { timers } from './helpers/timer';
import { SoundManifest, soundService } from './services/soundService';

export type AppOptions = {
  manifest: PIXI.AssetsManifest;
  sound: SoundManifest;
};

export class App {
  public stage: PIXI.Container = new PIXI.Container();
  public dudes: Record<string, Dude> = {};

  public chatterIds: string[] = [];

  public settings: SettingsEntity = {};

  public renderer!: PIXI.Renderer;

  public async init(options: AppOptions, element: HTMLElement): Promise<void> {
    await assetsLoader.load(options.manifest);
    soundService.init(options.sound);

    this.renderer = new PIXI.Renderer({
      width: element.clientWidth,
      height: element.clientHeight,
      backgroundAlpha: 0,
    });

    element.appendChild(this.renderer.view as HTMLCanvasElement);

    window.onresize = (): void => {
      this.renderer.resize(element.clientWidth, element.clientHeight);
    };

    this.stage.sortableChildren = true;

    dudesManager.subscribe({
      onAdd: (dude: Dude) => this.stage.addChild(dude.container),
      onDelete: (dude: Dude) => {
        this.stage.removeChild(dude.container);
        this.stage.removeChild(dude.trail.container);
      }
    });
  }

  public updateSettings(data: SettingsEntity): void {
    this.settings = data;
  }

  public update(): void {
    timers.tick();
    dudesManager.update();

    this.renderer.render(this.stage);
  }
}

export const app = new App();
