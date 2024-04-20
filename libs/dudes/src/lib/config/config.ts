export type Sprites = {
  [key: string]: SpriteConfig;
};

export type Config = {
  sprites: Sprites;
};

export type SpriteConfig = {
  name: string;
  w: number;
  h: number;
  collider: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  pivot: {
    x: number;
    y: number;
  };
};

export const config: Config = {
  sprites: {
    sith: {
      name: 'sith',
      w: 32,
      h: 32,
      collider: {
        x: 8,
        y: 5,
        w: 16,
        h: 20,
      },
      pivot: {
        x: 0,
        y: 9,
      },
    },
    agent: {
      name: 'agent',
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
    nerd: {
      name: 'nerd',
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
    girl: {
      name: 'girl',
      w: 32,
      h: 32,
      collider: {
        x: 8,
        y: 5,
        w: 16,
        h: 20,
      },
      pivot: {
        x: 0,
        y: 9,
      },
    },
    cat: {
      name: 'cat',
      w: 32,
      h: 32,
      collider: {
        x: 8,
        y: 4,
        w: 16,
        h: 21,
      },
      pivot: {
        x: 0,
        y: 9,
      },
    },
    senior: {
      name: 'senior',
      w: 32,
      h: 32,
      collider: {
        x: 8,
        y: 4,
        w: 16,
        h: 21,
      },
      pivot: {
        x: 0,
        y: 9,
      },
    },
    sponge: {
      name: 'sponge',
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
  },
};
