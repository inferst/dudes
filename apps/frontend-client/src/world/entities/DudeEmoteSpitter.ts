import { Container, Sprite } from 'pixi.js';
import { Constants } from '@app/frontend-client/config/constants';
import { Point } from '@app/frontend-client/helpers/types';
import { Timer } from '@app/frontend-client/helpers/timer';

export type DudeEmoteSpitterProps = {
  position: Point;
};

export class DudeEmoteSpitter {
  public container: Container = new Container();

  private emotes: Sprite[] = [];

  private moveSpeed = 50;
  private alphaSpeed = 1;
  private scaleSpeed = 0.5;

  private timer?: Timer;

  public add(url: string): void {
    const sprite = Sprite.from(url);
    sprite.anchor.set(0.5, 0.5);
    sprite.scale.set(0, 0);
    this.emotes.push(sprite);
  }

  public update(props: DudeEmoteSpitterProps): void {
    this.timer?.tick();

    if (!this.timer || this.timer.isCompleted) {
      if (this.emotes.length > 0) {
        this.timer = new Timer(2000, () => {
          const sprite = this.emotes.shift();
          this.container.addChild(sprite!);
        });
      }
    }

    this.container.position.x = props.position.x ?? this.container.position.x;
    this.container.position.y = props.position.y ?? this.container.position.y;

    for (const child of this.container.children) {
      child.position.y -= (Constants.fixedDeltaTime * this.moveSpeed) / 1000;
      child.scale.x += (Constants.fixedDeltaTime * this.scaleSpeed) / 1000;
      child.scale.y += (Constants.fixedDeltaTime * this.scaleSpeed) / 1000;

      if (child.scale.x > 1) {
        child.alpha -= (Constants.fixedDeltaTime * this.alphaSpeed) / 1000;
      }

      if (child.alpha <= 0) {
        this.container.removeChild(child);
      }
    }
  }
}
