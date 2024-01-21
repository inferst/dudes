import { Constants } from '@app/frontend-client/config/constants';
import { Point } from '@app/frontend-client/helpers/types';
import { AnimatedSprite, Container } from 'pixi.js';

export type DudeSpriteContainerProps = {
  color: string;
  scale: Point;
}

export class DudeSpriteContainer {
  private body: AnimatedSprite;
  private eyes: AnimatedSprite;

  public container: Container;

  constructor({ body, eyes }: { body: AnimatedSprite; eyes: AnimatedSprite }) {
    this.body = body;
    this.eyes = eyes;

    this.body.zIndex = 1;
    this.eyes.zIndex = 2;

    this.container = new Container();
    this.container.addChild(body, eyes);
    this.container.sortableChildren = true;

    this.body.anchor.set(0.5);
    this.eyes.anchor.set(0.5);

    this.body.autoUpdate = false;
    this.body.play();

    this.eyes.autoUpdate = false;
    this.eyes.play();
  }

  public update(props: DudeSpriteContainerProps): void {
    this.body.tint = props.color;
    this.container.scale.set(props.scale.x, props.scale.y)

    this.body.update(Constants.fixedDeltaTime * 0.06);
    this.eyes.update(Constants.fixedDeltaTime * 0.06);
  }

  public tint(color: string): void {
    this.body.tint = color;
  }
}
