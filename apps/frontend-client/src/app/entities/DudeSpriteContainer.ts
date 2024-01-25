import { FIXED_DELTA_TIME } from '@app/frontend-client/config/constants';
import { Point } from '@app/frontend-client/helpers/types';
import {
  DudeLayerAnimatedSprite,
  DudeSpriteLayers,
} from '@app/frontend-client/sprite/spriteProvider';
import { Container } from 'pixi.js';

export type DudeSpriteContainerProps = {
  color: {
    [key in DudeSpriteLayers]?: string;
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
            if (color == 'transparent') {
              layer.sprite.visible = false;
            } else {
              layer.sprite.visible = true;
            }

            layer.sprite.tint = color ?? 0xffffff;
          }
        }
      }
    }

    this.container.scale.set(props.scale.x, props.scale.y);
  }
}
