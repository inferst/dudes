import { Text, Container, TextMetrics, Graphics } from 'pixi.js';
import { Constants } from '@app/frontend-client/config/constants';
import { Dude } from './Dude';
import { World } from '../World';

export class DudeMessageBox {
  public view: Container = new Container();

  private container: Container = new Container();
  private box?: Graphics;

  private padding: number = 10;
  private borderRadius: number = 10;
  private boxColor: number = 0xeeeeee;
  private textColor: number = 0x222222;
  private fontFamily: string = 'Rubik';
  private fontSize: number = 20;

  private animationTime = 500;
  private currentAnimationTime = 0;
  private shift = 30;

  private showTime = 10000;
  private currentShowTime = 0;

  private messageQueue: string[] = [];

  constructor() {
    this.view.addChild(this.container);
  }

  private trim(text: Text): string {
    const metrics = TextMetrics.measureText(text.text, text.style);

    return metrics.lines.length > 4
      ? metrics.lines.slice(0, 4).join(' ').slice(0, -3) + '...'
      : text.text;
  }

  public update(dude: Dude): void {
    if (this.currentAnimationTime >= 0) {
      this.currentAnimationTime -= Constants.fixedDeltaTime;

      this.container.alpha += Constants.fixedDeltaTime / this.animationTime;
      this.container.position.y -=
        (this.shift * Constants.fixedDeltaTime) / this.animationTime;
    }

    if (this.currentShowTime <= this.animationTime) {
      this.container.alpha -= Constants.fixedDeltaTime / this.animationTime;
    }

    if (this.currentShowTime <= 0) {
      if (this.container.children.length > 0) {
        this.container.removeChildren();
      }

      if (this.messageQueue.length > 0) {
        const message = this.messageQueue.shift();

        if (message) {
          const zIndex = Object.values(World.dudes).reduce(
            (zIndex, dude) => {
              return zIndex <= dude.view.zIndex ? dude.view.zIndex + 1 : zIndex;
            },
            dude.view.zIndex
          );
          dude.view.zIndex = zIndex;
          this.show(message);
        }

        this.currentShowTime = this.showTime;
        this.currentAnimationTime = this.animationTime;
      }
    } else {
      this.currentShowTime -= Constants.fixedDeltaTime;
      this.container.position.y = Math.sin(this.currentShowTime* 0.0025) * 4 - 2;
    }
  }

  public add(message: string): void {
    this.messageQueue.push(message);
  }

  private show(message: string): void {
    const text = new Text(message, {
      fontFamily: this.fontFamily,
      fontSize: this.fontSize,
      fill: this.textColor,
      align: 'left',
      breakWords: true,
      wordWrap: true,
      wordWrapWidth: 200,
    });

    text.anchor.set(0.5, 1);
    text.position.set(0, -this.padding);
    text.text = this.trim(text);

    const roundedRect = {
      x: text.x - this.padding - text.width * text.anchor.x,
      y: text.y - this.padding - text.height * text.anchor.y,
      w: text.width + this.padding * 2,
      h: text.height + this.padding * 2,
    };

    this.box = new Graphics();
    this.box.beginFill(this.boxColor);
    this.box.drawRoundedRect(
      roundedRect.x,
      roundedRect.y,
      roundedRect.w,
      roundedRect.h,
      this.borderRadius
    );
    this.box.drawPolygon(
      {
        x: roundedRect.x + roundedRect.w / 2 - 10,
        y: roundedRect.y + roundedRect.h,
      },
      {
        x: roundedRect.x + roundedRect.w / 2 + 10,
        y: roundedRect.y + roundedRect.h,
      },
      {
        x: roundedRect.x + roundedRect.w / 2,
        y: roundedRect.y + roundedRect.h + 10 - 4,
      }
    );

    this.box.endFill();

    this.container.alpha = 0;
    this.container.position.y = this.shift;

    this.container.addChild(this.box, text);
  }
}
