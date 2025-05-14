import { Evotars } from 'evotars';

export class Debug {
  constructor(readonly evotars: Evotars) {
    this.generateEvotars();
  }

  public generateEvotars(): void {
    this.evotars.processMessage({
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
      this.evotars.processAction({
        userId: '1',
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

      this.evotars.processAction({
        userId: '1',
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
