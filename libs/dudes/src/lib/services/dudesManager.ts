import {
  ChatterEntity,
  MessageEntity,
  RaidData,
  UserActionEntity,
  isColorUserActionEntity,
  isGrowUserActionEntity,
  isJumpUserActionEntity,
} from '@lib/types';
import tinycolor from 'tinycolor2';
import { config } from '../config/config';
import { timers } from '../helpers/timer';
import { app } from '../app';
import { Dude, DudeProps } from '../entities/Dude';
import { Color } from 'pixi.js';

type DudesManagerSubscription = {
  onAdd: (dude: Dude) => void;
  onDelete: (dude: Dude) => void;
};

const DUDE_DESPAWN_TIMER = 1000 * 60 * 5;

class DudesManager {
  private viewers: Record<string, Dude | undefined> = {};

  private raiders: Dude[] = [];

  private lastDudeActivity: Record<string, number | undefined> = {};

  private subscriptions: DudesManagerSubscription[] = [];

  public subscribe(subscription: DudesManagerSubscription) {
    this.subscriptions.push(subscription);
  }

  public update() {
    for (const id in this.viewers) {
      const viewer = this.viewers[id];

      if (viewer) {
        viewer.update();
      }
    }

    for (const dude of this.raiders) {
      dude.update();
    }
  }

  public processRaid(data: RaidData) {
    if (!app.settings.fallingRaiders) {
      return;
    }

    const time = (1 / data.viewers) * 5000;

    for (let i = 0; i < data.viewers; i++) {
      const dude = new Dude({ isAnonymous: true, zIndex: -1 });

      timers.add(time * i, () => {
        this.addRaider(dude);
        dude.spawn({ isFalling: true });
      });

      timers.add(i * time + 30000, () => {
        dude.despawn({
          onComplete: () => {
            this.deleteRaider(dude);
          },
        });
      });
    }

    const dude = this.viewers[data.broadcaster.id];

    const props: DudeProps = {
      ...this.prepareDudeProps(
        data.broadcaster.info.displayName,
        data.broadcaster.info.color
      ),
      scale: 8,
    };

    const spawnBroadcaster = () => {
      const dude = new Dude(props);
      this.addViewer(data.broadcaster.id, dude);
      dude.spawn({ isFalling: true, positionX: 0.5 });
    };

    this.lastDudeActivity[data.broadcaster.id] = performance.now();

    if (!dude) {
      spawnBroadcaster();
    } else {
      dude.despawn({
        onComplete: () => {
          spawnBroadcaster();
        },
      });
    }
  }

  public processChatters(data: ChatterEntity[]) {
    for (const id in this.viewers) {
      const lastMessageTime = this.lastDudeActivity[id];
      const spawnedRecently =
        !!lastMessageTime &&
        performance.now() - lastMessageTime < DUDE_DESPAWN_TIMER;

      if (data.every((chatter) => chatter.userId != id) && !spawnedRecently) {
        const dude = this.viewers[id];

        if (dude) {
          dude.despawn({
            onComplete: () => {
              this.deleteViewer(id, dude);
            },
          });
        }
      }
    }

    if (app.settings.showAnonymousDudes) {
      for (const chatter of data) {
        const dude = this.viewers[chatter.userId];

        if (!dude) {
          const props = {
            name: chatter.name,
            isAnonymous: !this.hasActivity(chatter.userId),
          };

          const dude = new Dude(props);
          dude.spawn();

          this.addViewer(chatter.userId, dude);
        }
      }
    }
  }

  private hasActivity = (userId: string): boolean =>
    !!this.lastDudeActivity[userId];

  public doAction(action: UserActionEntity, dude: Dude) {
    if (isJumpUserActionEntity(action)) {
      dude.jump();
    }

    if (isColorUserActionEntity(action)) {
      const color = tinycolor(action.data.color);

      if (color && color.isValid()) {
        dude.setUserProps({ color: new Color(action.data.color) });
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

  private prepareDudeProps(name: string, color?: string): DudeProps {
    const props: DudeProps = {
      name,
      isAnonymous: false,
    };

    const sprite = config.chatters[name];

    if (sprite) {
      props.sprite = sprite;
    }

    if (color) {
      props.color = new Color(color);
    }

    return props;
  }

  public processAction(action: UserActionEntity): void {
    const dude = this.viewers[action.userId];

    const props: DudeProps = this.prepareDudeProps(
      action.info.displayName,
      action.info.color
    );

    if (!dude) {
      const dude = new Dude(props);

      dude.spawn({
        onComplete: () => {
          const dude = this.viewers[action.userId];
          if (dude) {
            this.doAction(action, dude);
          }
        },
      });

      this.addViewer(action.userId, dude);
    } else {
      this.doAction(action, dude);
      dude.setProps(props);
    }
  }

  public processMessage(data: MessageEntity): void {
    const props: DudeProps = this.prepareDudeProps(
      data.info.displayName,
      data.info.color
    );

    let dude = this.viewers[data.userId];

    if (!dude) {
      const isFalling = app.settings.fallingDudes
        ? !this.hasActivity(data.userId)
        : false;

      dude = new Dude(props);
      dude.spawn({ isFalling });

      this.addViewer(data.userId, dude);
    } else {
      dude.setProps(props);
    }

    this.lastDudeActivity[data.userId] = performance.now();

    if (data.message) {
      dude.addMessage(data.message);
    }

    if (data.emotes.length > 0) {
      dude.spitEmotes(data.emotes);
    }
  }

  public addViewer(id: string, dude: Dude): void {
    this.subscriptions.forEach((s) => s.onAdd(dude));
    this.viewers[id] = dude;
  }

  public deleteViewer(id: string, dude: Dude): void {
    this.subscriptions.forEach((s) => s.onDelete(dude));
    delete this.viewers[id];
  }

  public addRaider(dude: Dude): void {
    this.subscriptions.forEach((s) => s.onAdd(dude));
    this.raiders.push(dude);
  }

  public deleteRaider(dude: Dude): void {
    this.subscriptions.forEach((s) => s.onDelete(dude));
    this.raiders = this.raiders.filter((raider) => raider != dude);
  }

  public zIndexDudeMax(from: number) {
    return Object.values(this.viewers).reduce((zIndex, dude) => {
      return dude && zIndex <= dude.container.zIndex
        ? dude.container.zIndex + 1
        : zIndex;
    }, from);
  }

  public zIndexDudeMin(from: number) {
    return Object.values(this.viewers).reduce((zIndex, dude) => {
      return dude && zIndex >= dude.container.zIndex
        ? dude.container.zIndex - 1
        : zIndex;
    }, from);
  }
}

export const dudesManager = new DudesManager();
