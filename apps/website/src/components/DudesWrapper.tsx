'use client';

import type { SettingsEntity, UserActionEntity } from '@repo/types';
import type { ActionData } from 'evotars';
import { Evotars } from 'evotars';
import { useCallback, useState } from 'react';

export const DudesWrapper = () => {
  const [isInit, setIsInit] = useState(false);

  const initDudes = useCallback(
    async (element: HTMLDivElement) => {
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
        data?: ActionData,
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

      const evotars = new Evotars(element, {
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
          const path = '/static/skins/dudes/' + name + '/';
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

      await evotars.run();
      evotars.updateSettings(settings);

      await delay(500);
      evotars.processMessage(mikeMessage('Hi! I am Mike!'));
      await delay(3000);

      evotars.processMessage(
        mikeMessage('I can do cool things! Watch me JUMP!'),
      );
      await delay(2000);
      evotars.processAction(mikeAction('jump'));

      await delay(3000);
      evotars.processMessage(mikeMessage('And I can dash, too!'));
      await delay(2000);
      evotars.processAction(mikeAction('dash'));

      await delay(3000);
      evotars.processMessage(mikeMessage('Check this out — I can grow!'));
      await delay(2000);
      evotars.processAction(mikeAction('grow'));

      await delay(3000);
      evotars.processMessage(
        mikeMessage('I can even change my skin.\nI want to be a cat!'),
      );

      await delay(2000);
      mikeInfo.sprite = 'cat';
      evotars.processAction(mikeAction('sprite', { sprite: 'cat' }));

      await delay(3000);
      evotars.processMessage(randomMessage("What's going on here?"));
      await delay(2000);
      evotars.processMessage(randomMessage('Hey!'));
      await delay(2000);
      evotars.processMessage(randomMessage('Is this a party?'));
      await delay(2000);
      evotars.processMessage(mikeMessage('Haha! It is a party! Come join us!'));

      await delay(3000);
      evotars.processRaid({
        viewers: {
          count: 10,
          sprite: 'agent',
        },
        broadcaster: {
          id: 'raider',
          info: raiderInfo,
        },
      });

      evotars.processMessage(raiderMessage('RAID!!!'));
      await delay(2000);
      evotars.processMessage(mikeMessage('OMG!'));
    },
    [isInit],
  );

  const ref = (element: HTMLDivElement) => {
    initDudes(element);
  };

  return <div className="w-[89%] h-[47%] mt-[6%]" ref={ref} />;
};
