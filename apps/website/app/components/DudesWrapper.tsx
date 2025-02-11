import { SettingsEntity, UserActionEntity } from '@lib/types';
import { ActionData, Evotars } from 'evotars';
import { useCallback, useState } from 'react';

export const DudesWrapper = () => {
  const [isInit, setIsInit] = useState(false);

  const initDudes = useCallback(async (element: HTMLDivElement) => {
    if (typeof document == 'undefined' || !element || isInit) {
      return;
    }

    const delay = (ms: number) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    const mikeInfo = {
      color: 'red',
      displayName: 'Mike',
      sprite: 'dude',
    };

    const raiderInfo = {
      sprite: 'sith',
      color: 'green',
      displayName: 'Raider',
    };

    const mikeMessage = (message: string) => ({
      message,
      userId: '1',
      emotes: [],
      info: mikeInfo,
    });

    const raiderMessage = (message: string) => ({
      message,
      userId: 'raider',
      emotes: [],
      info: raiderInfo,
    });

    const mikeAction = (
      action: string,
      data?: ActionData
    ): UserActionEntity => ({
      userId: '1',
      id: 1,
      title: 'Action',
      description: 'Description',
      data: data ?? {},
      info: mikeInfo,
      name: action,
    });

    let userId = 1;

    const rand = (options: string[]): string => {
      const rand = Math.random();
      const index = Math.floor(rand * options.length);
      return options[index];
    };

    const randomMessage = (message: string) => ({
      message,
      userId: (++userId).toString(),
      emotes: [],
      info: {
        color: rand(['pink', 'blue', 'red', 'green', 'yellow']),
        displayName: 'Dude',
        sprite: 'dude',
      },
    });

    setIsInit(true);

    const settings: SettingsEntity = {
      fallingDudes: true,
      fallingRaiders: true,
    };

    const dudes = new Evotars(element, {
      font: '/static/fonts/Rubik-VariableFont_wght.ttf',
      sounds: { jump: { src: '/static/sounds/jump.mp3' } },
      assets: {
        poof: '/static/poof.json',
        rip1: '/static/rip1.png',
        rip2: '/static/rip2.png',
        skull: '/static/skull.png',
        weight: '/static/weight.png',
      },
      spriteLoaderFn: async (name: string) => {
        const path = '/dudes/' + name + '/';
        const sprite = await fetch(path + 'sprite.json');
        const spriteJson = await sprite.json();
        const data = await fetch(path + 'data.json');
        const dataJson = await data.json();

        return {
          data: dataJson,
          image: path + 'sprite.png',
          sprite: spriteJson,
        };
      },
    });

    await dudes.run();
    dudes.updateSettings(settings);

    await delay(500);
    dudes.processMessage(mikeMessage('Hi! I am Mike!'));
    await delay(10000);

    dudes.processMessage(mikeMessage('I can do some actions! JUMP!!!'));
    await delay(2000);
    dudes.processAction(mikeAction('jump'));

    await delay(8000);
    dudes.processMessage(mikeMessage('I can dash!'));
    await delay(2000);
    dudes.processAction(mikeAction('dash'));

    await delay(8000);
    dudes.processMessage(mikeMessage('I can grow up!'));
    await delay(2000);
    dudes.processAction(mikeAction('grow'));

    await delay(8000);
    dudes.processMessage(
      mikeMessage('I can change my skin.\nI want to be a cat!')
    );
    await delay(2000);
    mikeInfo.sprite = 'cat';
    dudes.processAction(mikeAction('sprite', { sprite: 'cat' }));

    await delay(8000);
    dudes.processMessage(randomMessage("What's going on here?"));
    await delay(2000);
    dudes.processMessage(randomMessage('Hey'));
    await delay(2000);
    dudes.processMessage(randomMessage('Is it a party here?'));
    await delay(2000);
    dudes.processMessage(mikeMessage("Hahaha! It's a party! Join us ;)"));

    await delay(10000);
    dudes.processRaid({
      viewers: {
        count: 10,
        sprite: 'agent',
      },
      broadcaster: {
        id: 'raider',
        info: raiderInfo,
      },
    });

    dudes.processMessage(raiderMessage('RAID!!!'));
    await delay(2000);
    dudes.processMessage(mikeMessage('OMG!'));
  }, []);

  return (
    <div
      className="border border-border/100"
      ref={initDudes}
      style={{ height: 480, width: 1000 }}
    ></div>
  );
};
