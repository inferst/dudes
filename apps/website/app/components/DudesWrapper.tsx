import { Dudes } from '@lib/dudes';
import { useCallback, useState } from 'react';
import { manifest } from '../assets/manifest';
import { SettingsEntity } from '@lib/types';

export const DudesWrapper = () => {
  const [isInit, setIsInit] = useState(false);

  const initDudes = useCallback(async (element: HTMLDivElement) => {
    if (typeof document == 'undefined' || !element || isInit) {
      return;
    }

    setIsInit(true);

    const sound = { jump: '/sounds/jump.mp3' };
    const settings: SettingsEntity = {
      fallingDudes: true,
    };

    const dudes = new Dudes(element);
    await dudes.run({ manifest, sound });
    dudes.updateSettings(settings);

    setTimeout(() => {
      dudes.processMessage({
        message: 'Hello!',
        userId: '1',
        emotes: [],
        info: {
          color: 'pink',
          displayName: 'Dude',
        },
      });
    }, 500);
  }, []);

  return <div ref={initDudes} style={{ height: 480 }}></div>;
};
