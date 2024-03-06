import * as PIXI from 'pixi.js';

export interface AsepriteFrameData extends PIXI.ISpritesheetFrameData {
  duration: number;
}

export interface AsepriteData extends PIXI.ISpritesheetData {
  frames: Record<string, AsepriteFrameData>;
  duration: number;
}

export class AssetsLoader {
  private isLoaded = false;

  public sheets: Record<string, PIXI.Spritesheet<AsepriteData>> = {};

  async load(manifest: PIXI.AssetsManifest): Promise<void> {
    if (!this.isLoaded) {
      this.isLoaded = true;
      await PIXI.Assets.init({ manifest });
      this.sheets = await PIXI.Assets.loadBundle('main');
      await PIXI.Assets.loadBundle('fonts');
    }
  }
}

export const assetsLoader = new AssetsLoader();
