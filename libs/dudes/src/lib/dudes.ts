import {
  ChatterEntity,
  MessageEntity,
  RaidData,
  SettingsEntity,
  UserActionEntity,
} from '@lib/types';
import { AppOptions, app } from './app';
import { dudesManager } from './services/dudesManager';

export class Dudes {
  private isRendered = false;

  constructor(private readonly root: HTMLElement) {}

  processMessage = (data: MessageEntity) => dudesManager.processMessage(data);

  processAction = (data: UserActionEntity) => dudesManager.processAction(data);

  processChatters = (data: ChatterEntity[]) =>
    dudesManager.processChatters(data);

  processRaid = (data: RaidData) => dudesManager.processRaid(data);

  updateSettings(data: SettingsEntity) {
    app.updateSettings(data);
  }

  async run(options: AppOptions) {
    if (this.isRendered) {
      return;
    }

    this.isRendered = true;

    const init = async (): Promise<void> => {
      await app.init(options, this.root);

      let lastTime = performance.now();
      let lastFrame = -1;

      const maxFps = 60;

      const minElapsedMS = 1000 / maxFps;
      const maxElapsedMS = 100;

      requestAnimationFrame(animate);

      function animate(currentTime = performance.now()): void {
        let elapsedMS = currentTime - lastTime;

        if (elapsedMS > maxElapsedMS) {
          elapsedMS = maxElapsedMS;
        }

        const delta = (currentTime - lastFrame) | 0;

        if (delta > minElapsedMS) {
          lastFrame = currentTime - (delta % minElapsedMS);
          lastTime = currentTime;

          app.update();
        }

        requestAnimationFrame(animate);
      }
    };

    await init();
  }
}
