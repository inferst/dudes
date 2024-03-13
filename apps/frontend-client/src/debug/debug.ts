import { Dudes } from '@lib/dudes';

export class Debug {
  constructor(readonly dudes: Dudes) {
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
      },
    });

    setTimeout(() => {
      this.dudes.processAction({
        userId: '1',
        cooldown: 0,
        data: {},
        description: '',
        id: 1,
        name: 'jump',
        title: 'Jump',
        info: {
          displayName: 'haha',
          color: 'yellow',
        },
      });
    }, 1000);
  }
}
