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
          scale: 4,
        },
        description: '',
        id: 1,
        name: 'grow',
        title: 'Dash',
        info: {
          displayName: 'haha',
          color: 'yellow',
          sprite: 'dude',
        },
      });
    }, 1000);

    setTimeout(() => {
      this.dudes.processAction({
        userId: '1',
        cooldown: 0,
        data: {
          force: 15,
        },
        description: '',
        id: 1,
        name: 'dash',
        title: 'Dash',
        info: {
          displayName: 'haha',
          color: 'yellow',
          sprite: 'dude',
        },
      });
    }, 6000);
  }
}
