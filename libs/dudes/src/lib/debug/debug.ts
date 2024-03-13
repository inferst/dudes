import { app } from '../app';
import * as PIXI from 'pixi.js';
import { dudesManager } from '../services/dudesManager';

export class Debug {
  private readonly logs: string[] = [];

  public view: PIXI.Text;

  constructor() {
    this.view = new PIXI.Text();
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
      message: 'Привет!',
      info: {
        displayName: 'haha',
        color: 'yellow',
      },
    });

    setTimeout(() => {
      dudesManager.processAction({
        userId: '1',
        cooldown: 0,
        data: {},
        description: "",
        id: 1,
        name: 'jump',
        title: "Jump",
        info: {
          displayName: 'haha',
          color: 'yellow',
        },
      });
    }, 1000);
  }
}
