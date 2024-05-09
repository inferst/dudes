import { Evotars } from 'evotars';

export class Debug {
  constructor(readonly dudes: Evotars) {
    this.generateDudes();
  }

  public generateDudes(): void {
    this.dudes.processMessage({
      userId: '1',
      emotes: [],
      message: 'Привет!',
      info: {
        displayName: 'haha',
        color: 'yellow',
        sprite: 'dude',
      },
    });

    setTimeout(() => {
      this.dudes.processAction({
        userId: '1',
        cooldown: 0,
        data: {
          sprite: 'sith',
        },
        description: '',
        id: 1,
        name: 'sprite',
        title: 'Sprite',
        info: {
          displayName: 'haha',
          color: 'yellow',
          sprite: 'dude',
        },
      });

      this.dudes.processAction({
        userId: '1',
        cooldown: 0,
        data: {
          color: 'cyan',
        },
        description: '',
        id: 1,
        name: 'color',
        title: 'Color',
        info: {
          displayName: 'haha',
          color: 'yellow',
          sprite: 'dude',
        },
      });
    }, 2000);
  }
}
