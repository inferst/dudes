import { Point, Rect } from '@app/frontend-client/helpers/types';
import { Text } from 'pixi.js';

export type DudeNameProps = {
  name: string;
  position: Point;
  isVisible: boolean;
};

export class DudeName {
  public text: Text = new Text(undefined, {
    fontFamily: 'Rubik',
    fontSize: 18,
    fill: 0xffffff,
    align: 'center',
    lineJoin: 'round',
    strokeThickness: 4,
    stroke: 'black',
  });

  constructor() {
    this.text.anchor.set(0.5, 1);
    this.text.zIndex = 100;
  }

  update(props: DudeNameProps) {
    this.text.text = props.name ?? '';
    this.text.visible = props.isVisible;
    this.text.position.x = props.position.x ?? this.text.position.x;
    this.text.position.y = props.position.y ?? this.text.position.y;
  }

  rect = (): Rect => ({
    x: this.text.x,
    y: this.text.y,
    w: this.text.width,
    h: this.text.height,
  });
}
