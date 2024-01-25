import { app } from '@app/frontend-client/app/app';
import { Dude } from '@app/frontend-client/app/entities/Dude';
import { Text } from 'pixi.js';
import { config } from '../config/config';
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
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const keys = Object.keys(config.chatters);
        const index = Math.round(Math.random() * (keys.length - 1));
        const dude = new Dude({
          name: 'MikeRime',
          sprite: config.chatters[keys[index]],
        });
        dude.spawn(true);

        dudesManager.add('bot ' + i, dude);

        // setInterval(() => {
        //   dude.addMessage(
        //     'Приветики! Пистолетики. А что это ты тут стримишь, а?'
        //   );
        // }, 3000);

        setInterval(() => {
          dude.jump();
        }, i * 3000);

        setTimeout(() => {
          dude.scale({value: 4, duration: 10, cooldown: 0});
        }, 4000);
      }, 25 * i);
    }
  }
}
