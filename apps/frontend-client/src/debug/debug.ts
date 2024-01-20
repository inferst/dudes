import { Text } from 'pixi.js';
import { World } from '@app/frontend-client/world/World';
import { Dude } from '@app/frontend-client/world/entities/Dude';
import { config } from '../config/config';

export class Debug {
  private readonly logs: string[] = [];

  public view: Text;

  constructor() {
    this.view = new Text();
    this.view.position.set(10, 10);

    World.stage.addChild(this.view);

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
    for (let i = 0; i < 1; i++) {
      setTimeout(() => {
        const keys = Object.keys(config.chatters);
        const index = Math.round(Math.random() * (keys.length - 1));
        const dude = new Dude({
          name: 'MikeRime',
          sprite: config.chatters[keys[index]],
        });
        dude.spawn(true);

        World.addDude('bot ' + i, dude);

        // dude.fade();

        setInterval(() => {
          dude.addMessage(
            'Приветики! Пистолетики. А что это ты тут стримишь, а?'
          );
        }, 3000);

        setInterval(() => {
          dude.jump();
        }, 3000);

        setTimeout(() => {
          dude.fade();
        }, 10000);
      }, 10 * i);
    }
  }
}
