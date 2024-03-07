export const manifest = {
  bundles: [
    {
      name: 'main',
      assets: [
        {
          alias: 'dude',
          src: '/sprites/dude/dude.json',
        },
        {
          alias: 'sith',
          src: '/sprites/sith/sith.json',
        },
        {
          alias: 'agent',
          src: '/sprites/agent/agent.json',
        },
        {
          alias: 'girl',
          src: '/sprites/girl/girl.json',
        },
        {
          alias: 'senior',
          src: '/sprites/senior/senior.json',
        },
        {
          alias: 'cat',
          src: '/sprites/cat/cat.json',
        },
        {
          alias: 'nerd',
          src: '/sprites/nerd/nerd.json',
        }
      ],
    },
    {
      name: 'fonts',
      assets: [
        {
          alias: 'Rubik',
          src: '/fonts/Rubik.ttf',
        },
      ],
    }
  ],
};
