import { Timer } from '@app/frontend-client/helpers/timer';
import { Point } from '@app/frontend-client/helpers/types';
import { Tween } from '@tweenjs/tween.js';
import { Container, Graphics, Text, TextMetrics } from 'pixi.js';

export type DudeMesageProps = {
  position: Point;
};

export class DudeMessage {
  public container: Container = new Container();
  public animated: Container = new Container();

  private text: Text = new Text(undefined, {
    fontFamily: 'Rubik',
    fontSize: 20,
    fill: 0x222222,
    align: 'left',
    breakWords: true,
    wordWrap: true,
    wordWrapWidth: 200,
  });

  private padding: number = 10;
  private borderRadius: number = 10;
  private boxColor: number = 0xeeeeee;

  private fadeShift = 10;

  private isChecking = true;

  private messageQueue: string[] = [];

  private showTween?: Tween<Container>;
  private hideTween?: Tween<Container>;

  private timer?: Timer;

  constructor(private beforeShow: () => void) {
    this.container.addChild(this.animated);

    this.text.anchor.set(0.5, 1);
    this.text.position.set(0, -this.padding);
  }

  private trim(text: Text): string {
    const metrics = TextMetrics.measureText(text.text, text.style);

    return metrics.lines.length > 4
      ? metrics.lines.slice(0, 4).join(' ').slice(0, -3) + '...'
      : text.text;
  }

  public update(props: DudeMesageProps): void {
    this.timer?.tick();

    this.showTween?.update();
    this.hideTween?.update();

    if (this.isChecking && this.messageQueue.length > 0) {
      this.isChecking = false;

      const message = this.messageQueue.shift();

      if (message) {
        this.beforeShow();
        this.show(message);
      }
    }

    this.container.position.x = props.position.x ?? this.container.position.x;
    this.container.position.y = props.position.y ?? this.container.position.y;

    const isAnimationPlaying =
      this.showTween?.isPlaying() || this.hideTween?.isPlaying();

    if (!this.isChecking && !isAnimationPlaying && this.timer) {
      this.animated.position.y = Math.sin(this.timer.current * 0.0025) * 4 - 2;
    }
  }

  public add(message: string): void {
    this.messageQueue.push(message);
  }

  private drawBox(text: Text) {
    const roundedRect = {
      x: text.x - this.padding - text.width * text.anchor.x,
      y: text.y - this.padding - text.height * text.anchor.y,
      w: text.width + this.padding * 2,
      h: text.height + this.padding * 2,
    };

    const box = new Graphics();
    box.beginFill(this.boxColor);

    box.drawRoundedRect(
      roundedRect.x,
      roundedRect.y,
      roundedRect.w,
      roundedRect.h,
      this.borderRadius
    );

    box.drawPolygon(
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

    box.endFill();

    return box;
  }

  private show(message: string): void {
    this.text.text = message;
    this.text.text = this.trim(this.text);

    this.animated.alpha = 0;
    this.animated.position.y = this.fadeShift;

    const box = this.drawBox(this.text);

    this.animated.removeChildren();
    this.animated.addChild(box, this.text);

    const showProps = {
      alpha: 1,
      y: this.animated.y - this.fadeShift,
    };

    const hideProps = {
      alpha: 0,
      y: this.animated.y + this.fadeShift,
    };

    this.hideTween = new Tween(this.animated)
      .to(hideProps, 500)
      .onComplete(() => {
        this.isChecking = true;
      });

    this.showTween = new Tween(this.animated)
      .to(showProps, 500)
      .onComplete(() => {
        this.timer = new Timer(10000, () => {
          this.hideTween?.start();
        });
      });

    this.showTween.start();
  }
}
