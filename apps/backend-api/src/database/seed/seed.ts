import { PrismaClient } from '@prisma/client';
import { TWITCH_PLATFORM_ID } from '../../constants';
import { actionSeed } from './actions';
import { dudesSkinCollectionSeed } from './skins';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await actionSeed(prisma);
  await dudesSkinCollectionSeed(prisma);

  await prisma.platform.upsert({
    where: { id: TWITCH_PLATFORM_ID },
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
