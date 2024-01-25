import { SpriteConfig } from '@app/frontend-client/config/config';
import { Timer } from '@app/frontend-client/helpers/timer';
import { renderer } from '@app/frontend-client/main';
import {
  DudeSpriteLayers,
  DudeSpriteTags,
  DudeTagAnimatedSprites,
  spriteProvider,
} from '@app/frontend-client/sprite/spriteProvider';
import * as TWEEN from '@tweenjs/tween.js';
import * as PIXI from 'pixi.js';
import { DudeEmoteSpitter } from './DudeEmoteSpitter';
import { DudeMessage } from './DudeMessage';
import { DudeName } from './DudeName';
import { DudeSpriteContainer } from './DudeSpriteContainer';
import { dudesManager } from '../dudesManager';
import { FIXED_DELTA_TIME } from '@app/frontend-client/config/constants';

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

const DEFAULT_DUDE_SCALE = 4;

export class Dude {
  public container: PIXI.Container = new PIXI.Container();

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
      pivot: {
        x: 0,
        y: 9,
      },
    },
    color: '#969696',
    direction: 1,
    scale: DEFAULT_DUDE_SCALE,
    isAnonymous: false,
  };

  private animationState?: DudeSpriteTags;

  // TODO: Refactor sprite initializing, move logic to separate file
  private sprite?: DudeSpriteContainer;

  private tagSprites: DudeTagAnimatedSprites =
    spriteProvider.createTagAnimatedSprites(this.state.sprite.name);

  private name: DudeName = new DudeName();

  private message: DudeMessage = new DudeMessage(() => {
    this.container.zIndex = dudesManager.zIndexDudeMax(this.container.zIndex);
  });

  private emoteSpitter: DudeEmoteSpitter = new DudeEmoteSpitter();

  private velocity: PIXI.IPointData = {
    x: 0,
    y: 0,
  };

  private runSpeed: number = 0.05;

  private gravity: number = 0.2;

  private isJumping: boolean = false;

  private isDespawned: boolean = false;

  landTimer?: Timer;

  stateTimer?: Timer;

  scaleTimer?: Timer;

  cooldownScaleTimer?: Timer;

  spawnTween?: TWEEN.Tween<PIXI.Container>;

  fadeTween?: TWEEN.Tween<PIXI.Container>;

  scaleTween?: TWEEN.Tween<DudeState>;

  constructor(props: DudeProps = {}) {
    this.container.sortableChildren = true;
    this.emoteSpitter.container.zIndex = 1;
    this.message.container.zIndex = 2;

    this.container.addChild(this.name.text);
    this.container.addChild(this.emoteSpitter.container);
    this.container.addChild(this.message.container);

    void this.setAnimationState(DudeSpriteTags.Idle);

    if (props.sprite) {
      this.setSprite(props.sprite);
    }

    this.state = { ...this.state, ...props };

    this.stateTimer = new Timer(5000, () => {
      if (!this.isJumping) {
        this.setAnimationState(DudeSpriteTags.Run);
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
      const zIndex = dudesManager.zIndexDudeMin(this.container.zIndex);

      this.container.zIndex = zIndex;
      this.container.alpha = 0;

      this.spawnTween = new TWEEN.Tween(this.container)
        .to({ alpha: 1 }, 2000)
        .start();
    }
  }

  despawn(onComplete?: () => void): void {
    this.fadeTween = new TWEEN.Tween(this.container)
      .to({ alpha: 0 }, 5000)
      .onComplete(() => {
        this.isDespawned = true;
        onComplete && onComplete();
      })
      .start();
  }

  scale(options: { value: number; duration: number; cooldown: number }): void {
    if (this.cooldownScaleTimer && !this.cooldownScaleTimer.isCompleted) {
      return;
    }

    this.cooldownScaleTimer = new Timer(options.cooldown * 1000);

    this.scaleTween = new TWEEN.Tween(this.state)
      .to({ scale: DEFAULT_DUDE_SCALE * options.value }, 2000)
      .start();

    this.scaleTimer = new Timer(options.duration * 1000, () => {
      this.scaleTween = new TWEEN.Tween(this.state)
        .to({ scale: DEFAULT_DUDE_SCALE }, 2000)
        .start();
    });
  }

  jump(): void {
    if (this.isDespawned) {
      return;
    }

    if (!this.isJumping) {
      this.isJumping = true;

      this.velocity.x = this.state.direction * 3.5;
      this.velocity.y = -8;

      this.setAnimationState(DudeSpriteTags.Jump);

      jumpSound.pause();
      jumpSound.currentTime = 0;
      jumpSound.play().catch(() => {});
    }
  }

  setSprite(sprite: SpriteConfig) {
    if (sprite.name && sprite.name != this.state.sprite.name) {
      this.tagSprites = spriteProvider.createTagAnimatedSprites(sprite.name);

      if (this.animationState) {
        this.setAnimationState(this.animationState, true);
      }
    }
  }

  setProps(props: DudeProps) {
    if (props.sprite) {
      this.setSprite(props.sprite);
    }

    this.state = { ...this.state, ...props };
  }

  setUserProps(props: UserProps) {
    this.userState = { ...this.userState, ...props };
  }

  update(): void {
    if (this.isDespawned) {
      return;
    }

    this.landTimer?.tick();
    this.stateTimer?.tick();
    this.scaleTimer?.tick();

    this.cooldownScaleTimer?.tick();

    this.fadeTween?.update();
    this.spawnTween?.update();
    this.scaleTween?.update();

    const collider = this.state.sprite.collider;

    this.name.update({
      name: this.state.name,
      isVisible: !this.state.isAnonymous,
      position: {
        y:
          -(this.state.sprite.h / 2 - collider.y + this.state.sprite.pivot.y) *
          this.state.scale,
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
          this.setAnimationState(DudeSpriteTags.Run);
        } else if (this.animationState == DudeSpriteTags.Run) {
          this.setAnimationState(DudeSpriteTags.Idle);
        }
      });
    }

    if (this.animationState == DudeSpriteTags.Run) {
      const speed = this.runSpeed * this.state.direction;
      this.velocity.x = speed * FIXED_DELTA_TIME;
    }

    this.velocity.y = this.velocity.y + this.gravity;

    const position = {
      x: this.container.position.x + this.velocity.x,
      y: this.container.position.y + this.velocity.y,
    };

    if (this.isOnGround(position.y)) {
      this.velocity.y = 0;
      this.velocity.x = 0;

      position.y = renderer.height;

      if (this.animationState == DudeSpriteTags.Fall) {
        this.setAnimationState(DudeSpriteTags.Land);
        this.landTimer = new Timer(200, () => {
          this.setAnimationState(DudeSpriteTags.Idle);
          this.isJumping = false;
        });
      }
    }

    if (this.velocity.y > 0) {
      this.setAnimationState(DudeSpriteTags.Fall);
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
        color: {
          [DudeSpriteLayers.Body]: this.userState.color ?? this.state.color,
        },
        scale: {
          x: this.state.direction * this.state.scale,
          y: this.state.scale,
        },
      });
    }
  }

  isOnGround(y: number): boolean {
    return y > renderer.height;
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

  async setAnimationState(
    state: DudeSpriteTags,
    force: boolean = false
  ): Promise<void> {
    if (this.animationState == state && !force) {
      return;
    }

    this.animationState = state;

    if (this.sprite) {
      this.container.removeChild(this.sprite.container);
    }

    // TODO: Refactor sprite initializing, move logic to separate file
    const layerAnimatedSprites = this.tagSprites[this.animationState];

    this.sprite = new DudeSpriteContainer(layerAnimatedSprites);

    this.sprite.container.pivot.set(
      this.state.sprite.pivot.x,
      this.state.sprite.pivot.y
    );

    this.container.addChild(this.sprite.container);
  }
}
