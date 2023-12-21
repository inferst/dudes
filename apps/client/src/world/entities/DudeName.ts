import { Text } from 'pixi.js';

export class DudeName {
  public view: Text;

  constructor(name: string) {
    this.view = new Text(name, {
      fontFamily: 'Arial',
      fontSize: 18,
      fill: 0xffffff,
      align: 'center',
      lineJoin: 'round',
      strokeThickness: 4,
      stroke: 'black',
    });

    this.view.anchor.set(0.5, 1);
    this.view.zIndex = 100;
  }
}
