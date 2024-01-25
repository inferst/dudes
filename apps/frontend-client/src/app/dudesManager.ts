import {
  ChatterEntity,
  MessageEntity,
  UserActionEntity,
  isColorUserActionEntity,
  isGrowUserActionEntity,
  isJumpUserActionEntity,
} from '@shared';
import { Dude, DudeProps } from './entities/Dude';
import tinycolor from 'tinycolor2';
import { config } from '../config/config';
import { app } from './app';

type DudesManagerSubscription = {
  onAdd: (dude: Dude) => void;
  onDelete: (dude: Dude) => void;
};

const DUDE_DESPAWN_TIMER = 1000 * 60 * 5;

class DudesManager {
  private dudes: Record<string, Dude> = {};

  private lastMessageTimes: Record<string, number> = {};

  private subscriptions: DudesManagerSubscription[] = [];

  public subscribe(subscription: DudesManagerSubscription) {
    this.subscriptions.push(subscription);
  }

  public update() {
    for (const id in this.dudes) {
      this.dudes[id].update();
    }
  }

  public processChatters(data: ChatterEntity[]) {
    for (const id in this.dudes) {
      const spawnedRecently =
        this.hasMessages(id) &&
        performance.now() - this.lastMessageTimes[id] < DUDE_DESPAWN_TIMER;

      if (data.every((chatter) => chatter.userId != id) && !spawnedRecently) {
        const dude = this.dudes[id];

        if (dude) {
          dude.despawn(() => {
            this.delete(id, dude);
          });
        }
      }
    }

    if (app.settings.showAnonymousDudes) {
      for (const chatter of data) {
        const dude = this.dudes[chatter.userId];

        if (!dude) {
          const props = {
            name: chatter.name,
            isAnonymous: !this.hasMessages(chatter.userId),
          };

          const dude = new Dude(props);
          dude.spawn();

          this.add(chatter.userId, dude);
        }
      }
    }
  }

  private hasMessages = (userId: string): boolean =>
    !!this.lastMessageTimes[userId];

  public processAction(action: UserActionEntity): void {
    const dude = this.dudes[action.userId];

    if (!dude) {
      return;
    }

    if (isJumpUserActionEntity(action)) {
      dude.jump();
    }

    if (isColorUserActionEntity(action)) {
      const color = tinycolor(action.data.color);

      if (color && color.isValid()) {
        dude.setUserProps({ color: action.data.color });
      }
    }

    if (isGrowUserActionEntity(action)) {
      dude.scale({
        value: action.data.scale,
        duration: action.data.duration,
        cooldown: action.cooldown,
      });
    }
  }

  public processMessage(data: MessageEntity): void {
    const props: DudeProps = { name: data.name };
    const sprite = config.chatters[data.name];

    if (sprite) {
      props.sprite = sprite;
    }

    const dude = this.dudes[data.userId];

    if (!dude) {
      const isFalling = app.settings.fallingDudes
        ? this.hasMessages(data.userId)
        : false;

      const dude = new Dude(props);
      dude.spawn(isFalling);

      this.add(data.userId, dude);
    } else {
      dude.setProps(props);
    }

    if (!this.hasMessages(data.userId)) {
      this.lastMessageTimes[data.userId] = performance.now();
    }

    if (data.message) {
      dude.addMessage(data.message);
    }

    if (data.emotes.length > 0) {
      dude.spitEmotes(data.emotes);
    }

    if (data.data.color) {
      dude.setProps({ color: data.data.color });
    }
  }

  public add(id: string, dude: Dude): void {
    this.subscriptions.forEach((s) => s.onAdd(dude));
    this.dudes[id] = dude;
  }

  public delete(id: string, dude: Dude): void {
    this.subscriptions.forEach((s) => s.onDelete(dude));
    delete this.dudes[id];
  }

  public zIndexDudeMax(from: number) {
    return Object.values(this.dudes).reduce((zIndex, dude) => {
      return zIndex <= dude.container.zIndex
        ? dude.container.zIndex + 1
        : zIndex;
    }, from);
  }

  public zIndexDudeMin(from: number) {
    return Object.values(this.dudes).reduce((zIndex, dude) => {
      return zIndex >= dude.container.zIndex
        ? dude.container.zIndex - 1
        : zIndex;
    }, from);
  }
}

export const dudesManager = new DudesManager();
