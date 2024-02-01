import { app } from '@app/frontend-client/app/app';
import { Text } from 'pixi.js';
import { dudesManager } from '../app/dudesManager';

export class Debug {
  private readonly logs: string[] = [];

  public view: Text;

  constructor() {
    this.view = new Text();
    this.view.position.set(10, 10);

    app.stage.addChild(this.view);

    this.generateDudes();
  }

  public log(text: string | number): void {
    if (this.logs.length > 10) {
      this.logs.shift();
    }

    this.logs.push(text.toString());

    this.view.text = this.logs.join('\n');
  }

  public generateDudes(): void {
    dudesManager.processMessage({
      userId: '1',
      emotes: [],
      message: 'Привет, я сейчас тебя зарейдю!',
      info: {
        displayName: 'tastyteadev',
        color: 'cyan',
      },
    });

    setTimeout(() => {
      dudesManager.processRaid({
        broadcaster: {
          id: '1',
          info: {
            displayName: 'tastyteadev',
            color: 'cyan',
          },
        },
        viewers: 500,
      });
    }, 1000);
  }
}
