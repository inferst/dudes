import { AsepriteData, assetsLoader } from './assetsLoader';
import * as PIXI from 'pixi.js';

export type DudeLayerAnimatedSprite = {
  layer: DudeSpriteLayers;
  sprite: PIXI.AnimatedSprite;
};

export type DudeTagAnimatedSprites = {
  [tag in DudeSpriteTags]: DudeLayerAnimatedSprite[];
};

export enum DudeSpriteLayers {
  Body = 'Body',
  Eyes = 'Eyes',
}

export enum DudeSpriteTags {
  Idle = 'Idle',
  Jump = 'Jump',
  Fall = 'Fall',
  Land = 'Land',
  Run = 'Run',
  Die = 'Die',
}

export type FrameTag = {
  from: number;
  name: string;
  to: number;
  direction: string;
};

export class SpriteProvider {
  public createLayerAnimatedSprites(
    name: string,
    sheet: PIXI.Spritesheet<AsepriteData>,
    frameTag: FrameTag
  ): DudeLayerAnimatedSprite[] {
    const layers = sheet.data.meta.layers;

    if (layers) {
      const textures = Object.fromEntries<PIXI.FrameObject[]>(
        layers.map((layer) => [layer.name, []])
      );

      for (let i = frameTag.from; i <= frameTag.to; i++) {
        const framekey = i.toString();

        for (const layer in textures) {
          const key = name + '_' + layer + '_' + framekey;
          const texture = sheet.textures[key];
          const time = sheet.data.frames[key].duration;

          textures[layer].push({ texture: texture, time: time });
        }
      }

      return Object.entries(textures).map((entry) => {
        const sprite = new PIXI.AnimatedSprite(entry[1]);
        sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        return { layer: entry[0] as DudeSpriteLayers, sprite };
      });
    }

    throw Error("Sprite sheet doesn't have layers");
  }

  public createTagAnimatedSprites(sheetName: string): DudeTagAnimatedSprites {
    if (!sheetName) {
      throw Error('Sheet is not defined');
    }

    const sheet = assetsLoader.sheets[sheetName];

    return (sheet.data.meta.frameTags ?? []).reduce<DudeTagAnimatedSprites>(
      (sprites, tag) => {
        if (tag && tag.name) {
          sprites[tag.name as DudeSpriteTags] = this.createLayerAnimatedSprites(
            sheetName,
            sheet,
            tag
          );
        }

        return sprites;
      },
      {} as DudeTagAnimatedSprites
    );
  }
}

export const spriteProvider = new SpriteProvider();
