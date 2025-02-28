import { actionSeed } from './actions';
import { dudesSkinCollectionSeed } from './skins';

import { prisma } from '../client';

async function main(): Promise<void> {
  await actionSeed(prisma);
  await dudesSkinCollectionSeed(prisma);

  await prisma.platform.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'twitch',
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
