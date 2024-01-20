import { SpriteConfig } from '@app/frontend-client/config/config';
import { Constants } from '@app/frontend-client/config/constants';
import { Timer } from '@app/frontend-client/helpers/timer';
import { renderer } from '@app/frontend-client/main';
import {
  DudeSpriteLayers,
  DudeSpriteTags,
  spriteProvider,
} from '@app/frontend-client/sprite/spriteProvider';
import * as TWEEN from '@tweenjs/tween.js';
import * as PIXI from 'pixi.js';
import { World } from '../World';
import { DudeEmoteSpitter } from './DudeEmoteSpitter';
import { DudeMessage } from './DudeMessage';
import { DudeName } from './DudeName';
import { DudeSpriteContainer } from './DudeSpriteContainer';

export type DudeProps = {
  name?: string;
  sprite?: SpriteConfig;
  color?: string;
  direction?: number;
  scale?: number;
  isAnonymous?: boolean;
};

type DudeState = Required<DudeProps>;

type UserProps = {
  color?: string;
};

const jumpSound = new Audio('/client/sounds/jump.mp3');
jumpSound.volume = 0.2;

export class Dude {
  private animationState?: DudeSpriteTags;

  private sprite?: DudeSpriteContainer;

  private name: DudeName = new DudeName();

  private message: DudeMessage = new DudeMessage(() => {
    const zIndex = World.zIndexDudeMax(this.container.zIndex);
    this.container.zIndex = zIndex;
  });

  public container: PIXI.Container = new PIXI.Container();

  private velocity: PIXI.IPointData = {
    x: 0,
    y: 0,
  };

  private runSpeed: number = 0.05;

  private gravity: number = 0.2;

  private emoteSpitter: DudeEmoteSpitter = new DudeEmoteSpitter();

  private isJumping: boolean = false;

  private userState: UserProps = {};

  private state: DudeState = {
    name: '',
    sprite: {
      name: 'dude',
      w: 32,
      h: 32,
      collider: {
        x: 8,
        y: 7,
        w: 16,
        h: 18,
      },
    },
    color: '#969696',
    direction: 1,
    scale: 4,
    isAnonymous: false,
  };

  landTimer?: Timer;

  stateTimer?: Timer;

  spawnTween?: TWEEN.Tween<PIXI.Container>;

  fadeTween?: TWEEN.Tween<PIXI.Container>;

  scaleTween?: TWEEN.Tween<DudeState>;

  constructor(props: DudeProps = {}) {
    this.state = { ...this.state, ...props };

    this.container.sortableChildren = true;
    this.emoteSpitter.container.zIndex = 1;
    this.message.container.zIndex = 2;

    this.container.addChild(this.name.text);
    this.container.addChild(this.emoteSpitter.container);
    this.container.addChild(this.message.container);

    void this.playAnimation(DudeSpriteTags.Idle);

    this.stateTimer = new Timer(5000, () => {
      if (!this.isJumping) {
        this.playAnimation(DudeSpriteTags.Run);
      }
    });
  }

  spawn(isFalling: boolean = false): void {
    const collider = this.state.sprite.collider;
    const fallingStartY = -(collider.y + collider.h - this.state.sprite.h / 2);
    const spawnY = isFalling ? fallingStartY : renderer.height;
    const spriteWidth = this.state.sprite.w * this.state.scale;

    const x = Math.random() * (renderer.width - spriteWidth) + spriteWidth / 2;
    const y = spawnY * this.state.scale;

    this.container.x = x;
    this.container.y = y;

    this.state.direction = Math.random() > 0.5 ? 1 : -1;

    if (!isFalling) {
      const zIndex = World.zIndexDudeMin(this.container.zIndex);

      this.container.zIndex = zIndex;
      this.container.alpha = 0;

      this.spawnTween = new TWEEN.Tween(this.container)
        .to({ alpha: 1 }, 2000)
        .start();
    }
  }

  fade(onComplete?: () => void): void {
    this.fadeTween = new TWEEN.Tween(this.container)
      .to({ alpha: 0 }, 5000)
      .onComplete(onComplete)
      .start();
  }

  scale(onComplete?: () => void): void {
    this.scaleTween = new TWEEN.Tween(this.state)
      .to({ scale: 8 }, 2000)
      .onComplete(onComplete)
      .start();
  }

  jump(): void {
    if (!this.isJumping) {
      this.isJumping = true;

      this.velocity.x = this.state.direction * 3.5;
      this.velocity.y = -8;

      this.playAnimation(DudeSpriteTags.Jump);

      jumpSound.pause();
      jumpSound.currentTime = 0;
      jumpSound.play().catch(() => {});
    }
  }

  setProps(props: DudeProps) {
    this.state = { ...this.state, ...props };
  }

  setUserProps(props: UserProps) {
    this.userState = { ...this.userState, ...props };
  }

  update(): void {
    this.landTimer?.tick();
    this.stateTimer?.tick();

    this.fadeTween?.update();
    this.spawnTween?.update();
    this.scaleTween?.update();

    const collider = this.state.sprite.collider;

    this.name.update({
      name: this.state.name,
      isVisible: !this.state.isAnonymous,
      position: {
        y: -(this.state.sprite.h / 2 - collider.y) * this.state.scale,
      },
    });

    this.message.update({
      position: {
        y: this.name.text.position.y - this.name.text.height - 6,
      },
    });

    this.emoteSpitter.update({
      position: {
        y: this.message.container.position.y - this.message.container.height,
      },
    });

    if (this.stateTimer?.isCompleted) {
      this.stateTimer = new Timer(Math.random() * 5000, () => {
        if (this.animationState == DudeSpriteTags.Idle) {
          this.playAnimation(DudeSpriteTags.Run);
        } else if (this.animationState == DudeSpriteTags.Run) {
          this.playAnimation(DudeSpriteTags.Idle);
        }
      });
    }

    if (this.animationState == DudeSpriteTags.Run) {
      const speed = this.runSpeed * this.state.direction;
      this.velocity.x = speed * Constants.fixedDeltaTime;
    }

    this.velocity.y = this.velocity.y + this.gravity;

    const position = {
      x: this.container.position.x + this.velocity.x,
      y: this.container.position.y + this.velocity.y,
    };

    if (this.isOnGround(position.y)) {
      this.velocity.y = 0;
      this.velocity.x = 0;

      position.y = renderer.height - this.anchorBottomDiff();

      if (this.animationState == DudeSpriteTags.Fall) {
        this.playAnimation(DudeSpriteTags.Land);
        this.landTimer = new Timer(200, () => {
          this.playAnimation(DudeSpriteTags.Idle);
          this.isJumping = false;
        });
      }
    }

    if (this.velocity.y > 0) {
      this.playAnimation(DudeSpriteTags.Fall);
    }

    if (this.animationState != DudeSpriteTags.Idle) {
      const halfSpriteWidth = (collider.w / 2) * this.state.scale;

      const left = this.container.x - halfSpriteWidth < 0;
      const right = this.container.x + halfSpriteWidth > renderer.width;

      if (left || right) {
        this.state.direction = -this.state.direction;
        this.velocity.x = -this.velocity.x;

        if (left) {
          position.x = halfSpriteWidth;
        }

        if (right) {
          position.x = renderer.width - halfSpriteWidth;
        }
      }
    }

    this.container.position.set(position.x, position.y);

    if (this.sprite) {
      this.sprite.update({
        color: this.userState.color ?? this.state.color,
        scale: {
          x: this.state.direction * this.state.scale,
          y: this.state.scale,
        },
      });
    }
  }

  anchorBottomDiff(): number {
    const collider = this.state.sprite.collider;
    return (
      (collider.y + collider.h - this.state.sprite.h / 2) * this.state.scale
    );
  }

  isOnGround(y: number): boolean {
    return y + this.anchorBottomDiff() > renderer.height;
  }

  addMessage(message: string): void {
    this.message.add(message);
    this.state.isAnonymous = false;
    this.fadeTween?.stop();
    this.fadeTween = undefined; // https://github.com/tweenjs/tween.js/issues/665
    this.container.alpha = 1;
  }

  spitEmotes(emotes: string[]): void {
    for (const emote of emotes) {
      this.emoteSpitter.add(emote);
    }
  }

  async playAnimation(state: DudeSpriteTags): Promise<void> {
    if (this.animationState == state) {
      return;
    }

    this.animationState = state;

    if (this.sprite) {
      this.container.removeChild(this.sprite.container);
    }

    const dudeSprite = spriteProvider.getSprite(this.state.sprite.name, state);
    this.sprite = new DudeSpriteContainer({
      body: dudeSprite[DudeSpriteLayers.Body],
      eyes: dudeSprite[DudeSpriteLayers.Eyes],
    });

    this.container.addChild(this.sprite.container);
  }
}
