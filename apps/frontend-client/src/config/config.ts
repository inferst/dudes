export type Chatters = {
  [key: string]: SpriteConfig;
};

export type Config = {
  chatters: Chatters;
};

export type SpriteConfig = {
  name: string;
  w: number,
  h: number,
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
      name: 'sith',
      w: 32,
      h: 32,
      collider: {
        x: 8,
        y: 5,
        w: 16,
        h: 20,
      },
    },
    St_zarus: {
      name: 'agent',
      w: 32,
      h: 32,
      collider: {
        x: 8,
        y: 7,
        w: 16,
        h: 18,
      },
    },
    Duckate: {
      name: 'girl',
      w: 32,
      h: 32,
      collider: {
        x: 8,
        y: 5,
        w: 16,
        h: 20,
      },
    },
    ArcticSpaceCat: {
      name: 'cat',
      w: 32,
      h: 32,
      collider: {
        x: 8,
        y: 4,
        w: 16,
        h: 21,
      },
    },
    kryptamine90: {
      name: 'senior',
      w: 32,
      h: 32,
      collider: {
        x: 8,
        y: 4,
        w: 16,
        h: 21,
      },
    },
  },
};
