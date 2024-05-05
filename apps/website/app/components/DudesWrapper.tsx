import { Evotars } from 'evotars';
import { useCallback, useState } from 'react';
import { SettingsEntity } from '@lib/types';

export const DudesWrapper = () => {
  const [isInit, setIsInit] = useState(false);

  const initDudes = useCallback(async (element: HTMLDivElement) => {
    if (typeof document == 'undefined' || !element || isInit) {
      return;
    }

    setIsInit(true);

    const settings: SettingsEntity = {
      fallingDudes: true,
    };

    const sounds = { jump: { src: '/sounds/jump.mp3' } };

    const dudes = new Evotars(element, {
      sounds,
      spriteLoaderFn: async (name: string) => {
        const path = '/evotars/' + name + '/';
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

    setTimeout(() => {
      dudes.processMessage({
        message: 'Hello!',
        userId: '1',
        emotes: [],
        info: {
          color: 'pink',
          displayName: 'Dude',
          sprite: 'dude',
        },
      });
    }, 500);
  }, []);

  return <div ref={initDudes} style={{ height: 480 }}></div>;
};
