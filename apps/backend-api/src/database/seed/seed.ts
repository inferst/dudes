import { PrismaClient } from '@prisma/client';
import { colorActionSeed } from './actions/color';
import { growActionSeed } from './actions/grow';
import { jumpActionSeed } from './actions/jump';
import { TWITCH_PLATFORM_ID } from '../../constants';
import { dashActionSeed } from './actions/dash';
import { spriteActionSeed } from './actions/sprite';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await jumpActionSeed(prisma);
  await colorActionSeed(prisma);
  await growActionSeed(prisma);
  await dashActionSeed(prisma);
  await spriteActionSeed(prisma);

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
