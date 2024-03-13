import { FIXED_DELTA_TIME } from '../config/constants';
import { Point } from '../helpers/types';
import {
  DudeLayerAnimatedSprite,
  DudeSpriteLayers,
} from '../services/spriteProvider';
import { Color, Container } from 'pixi.js';
import { DEFAULT_DUDE_SCALE } from './Dude';

export type DudeSpriteContainerProps = {
  color: {
    [key in DudeSpriteLayers]?: Color;
  };
  scale: Point;
};

export class DudeSpriteContainer {
  public container: Container = new Container();

  private sprites: DudeLayerAnimatedSprite[];

  constructor(sprites: DudeLayerAnimatedSprite[]) {
    this.sprites = sprites;

    this.container.sortableChildren = true;

    let zIndex = 0;

    for (const layer of this.sprites) {
      const sprite = layer.sprite;
      this.container.addChild(sprite);

      sprite.zIndex = ++zIndex;
      sprite.anchor.set(0.5, 0.5);
      sprite.autoUpdate = false;
      sprite.play();
    }
  }

  public update(props: DudeSpriteContainerProps): void {
    for (const layer of this.sprites) {
      layer.sprite.update(FIXED_DELTA_TIME * 0.06);

      if (props.color) {
        for (const colorLayer in props.color) {
          if (colorLayer == layer.layer) {
            const color = props.color[colorLayer];

            if (color) {
              layer.sprite.alpha = color.alpha;
              layer.sprite.tint = color;
            }
          }
        }
      }

      if (props.scale.x) {
        layer.sprite.animationSpeed = DEFAULT_DUDE_SCALE / Math.abs(props.scale.x);
      }
    }

    this.container.scale.set(props.scale.x, props.scale.y);
  }
}
