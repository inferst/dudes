export type Chatters = {
  [key: string]: SpriteConfig;
};

export type Config = {
  chatters: Chatters;
};

export type SpriteConfig = {
  sprite: string;
  collider: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
};

export const config: Config = {
  chatters: {
    nets1l: {
      sprite: 'sith',
      collider: {
        x: 8,
        y: 5,
        w: 16,
        h: 20,
      },
    },
    St_zarus: {
      sprite: 'agent',
      collider: {
        x: 8,
        y: 7,
        w: 16,
        h: 18,
      },
    },
    Duckate: {
      sprite: 'girl',
      collider: {
        x: 8,
        y: 5,
        w: 16,
        h: 20,
      },
    },
    ArcticSpaceCat: {
      sprite: 'cat',
      collider: {
        x: 8,
        y: 3,
        w: 16,
        h: 22,
      },
    },
    kryptamine90: {
      sprite: 'senior',
      collider: {
        x: 8,
        y: 4,
        w: 16,
        h: 21,
      },
    },
  },
};
