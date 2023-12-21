export type Chatters = {
  [key: string]: {
    sprite: string;
  };
};

export type Config = {
  chatters: Chatters;
};

export const config: Config = {
  chatters: {
    nets1l: {
      sprite: 'sith',
    },
    St_zarus: {
      sprite: 'agent',
    },
  },
};
