import * as PIXI from 'pixi.js';
import { app } from '../app';
import { Timer } from '../helpers/timer';
import { DudeSpriteContainer } from './DudeSpriteContainer';

export type DudeTrailEffectProps = {
  play: boolean;
};

export class DudeTrailEffect {
  public container: PIXI.Container = new PIXI.Container();

  private timer?: Timer;

  private sprite?: DudeSpriteContainer;

  private opacityStep = 0.1;

  private shadowStep = 50;

  constructor() {
    app.stage.addChild(this.container);
  }

  public setSprite(sprite: DudeSpriteContainer) {
    this.sprite = sprite;
  }

  public update(props: DudeTrailEffectProps): void {
    for (const child of this.container.children) {
      if (child.alpha > 0) {
        child.alpha = child.alpha - this.opacityStep;
      }
    }

    if (this.timer && !this.timer.isCompleted) {
      this.timer.tick();
    } else if (props.play) {
      this.timer = new Timer(this.shadowStep);

      const container = new PIXI.Container();

      if (this.sprite) {
        for (const layer of this.sprite.sprites) {
          const texture = layer.sprite.texture.clone();
          const sprite = new PIXI.Sprite(texture);

          sprite.anchor.set(0.5, 0.5);
          sprite.alpha = layer.sprite.alpha;
          sprite.tint = layer.sprite.tint;

          container.addChild(sprite);

          container.scale.set(
            this.sprite.container.scale.x,
            this.sprite.container.scale.y
          );

          container.pivot.set(
            this.sprite.container.pivot.x,
            this.sprite.container.pivot.y
          );

          const globalPosition = this.sprite.container.getGlobalPosition();
          container.position.set(globalPosition.x, globalPosition.y);
        }
      }

      this.container.addChild(container);
    }
  }
}
