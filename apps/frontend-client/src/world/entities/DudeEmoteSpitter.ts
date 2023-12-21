import { Container, Sprite } from 'pixi.js';
import { Constants } from '@app/frontend-client/config/constants';

export class DudeEmoteSpitter {
  public view: Container = new Container();

  private emotes: Sprite[] = [];

  private gapTime = 1000;
  private currentGapTime = 0;

  private moveSpeed = 50;
  private alphaSpeed = 1;
  private scaleSpeed = 0.5;

  public add(url: string): void {
    const sprite = Sprite.from(url);
    sprite.anchor.set(0.5, 0.5);
    sprite.scale.set(0, 0);
    this.emotes.push(sprite);
  }

  public update(): void {
    for (const child of this.view.children) {
      child.position.y -= (Constants.fixedDeltaTime * this.moveSpeed) / 1000;
      child.scale.x += (Constants.fixedDeltaTime * this.scaleSpeed) / 1000;
      child.scale.y += (Constants.fixedDeltaTime * this.scaleSpeed) / 1000;

      if (child.scale.x > 1) {
        child.alpha -= (Constants.fixedDeltaTime * this.alphaSpeed) / 1000;
      }

      if (child.alpha <= 0) {
        this.view.removeChild(child);
      }
    }

    if (this.currentGapTime >= 0) {
      this.currentGapTime -= Constants.fixedDeltaTime;
    } else {
      if (this.emotes.length > 0) {
        const sprite = this.emotes.shift();
        this.view.addChild(sprite!);
        this.currentGapTime = this.gapTime;
      }
    }
  }
}
