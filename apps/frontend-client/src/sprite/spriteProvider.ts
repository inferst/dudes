import {
  AsepriteData,
  assetsLoader,
} from '@app/frontend-client/assets/assetsLoader';
import * as PIXI from 'pixi.js';

export type DudeLayerAnimatedSprites = {
  [layer in DudeSpriteLayers]: PIXI.AnimatedSprite;
};

export type DudeTagAnimatedSprites = {
  [tag in DudeSpriteTags]: DudeLayerAnimatedSprites;
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
    sheet: PIXI.Spritesheet<AsepriteData>,
    frameTag: FrameTag
  ): DudeLayerAnimatedSprites {
    const layers = sheet.data.meta.layers;

    if (layers) {
      const textures = Object.fromEntries<PIXI.FrameObject[]>(
        layers.map((layer) => [layer.name, []])
      );

      for (let i = frameTag.from; i <= frameTag.to; i++) {
        const framekey = i.toString();

        for (const layer in textures) {
          const texture = sheet.textures[layer + '_' + i];
          const time = sheet.data.frames[layer + '_' + framekey].duration;

          textures[layer].push({ texture: texture, time: time });
        }
      }

      const entries = Object.entries(textures).map((entry) => {
        const sprite = new PIXI.AnimatedSprite(entry[1]);
        sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        return [entry[0], sprite];
      });

      return Object.fromEntries(entries);
    }

    throw Error("Sprite sheet doesn't have layers");
  }

  public createTagAnimatedSprites(sheetName: string): DudeTagAnimatedSprites {
    if (!sheetName) {
      throw Error('Sheet is not defined');
    }

    const sheet = assetsLoader.sheets[sheetName];

    return (sheet.data.meta.frameTags ?? []).reduce<DudeTagAnimatedSprites>((sprites, tag) => {
      if (tag && tag.name) {
        sprites[tag.name as DudeSpriteTags] = this.createLayerAnimatedSprites(sheet, tag);
      }

      return sprites;
    }, {} as DudeTagAnimatedSprites);
  }

  public getAnimatedSprite(
    sheetName: string,
    tagName: DudeSpriteTags
  ): DudeLayerAnimatedSprites {
    if (!sheetName) {
      throw Error('Sheet is not defined');
    }

    const sheet = assetsLoader.sheets[sheetName];

    const frameTag = sheet.data.meta.frameTags?.find(
      (tag) => tag.name == tagName
    );

    const layers = sheet.data.meta.layers;

    if (frameTag && layers) {
      const textures = Object.fromEntries<PIXI.FrameObject[]>(
        layers.map((layer) => [layer.name, []])
      );

      for (let i = frameTag.from; i <= frameTag.to; i++) {
        const framekey = i.toString();

        for (const layer in textures) {
          const texture = sheet.textures[layer + '_' + i];
          const time = sheet.data.frames[layer + '_' + framekey].duration;

          textures[layer].push({ texture: texture, time: time });
        }
      }

      const entries = Object.entries(textures).map((entry) => {
        const sprite = new PIXI.AnimatedSprite(entry[1]);
        sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        return [entry[0], sprite];
      });

      return Object.fromEntries(entries);
    }

    throw Error("Frame tag doesn't exist");
  }
}

export const spriteProvider = new SpriteProvider();
