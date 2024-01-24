import { PrismaClient } from '@prisma/client';
import { colorActionSeed } from './actions/color';
import { growActionSeed } from './actions/grow';
import { jumpActionSeed } from './actions/jump';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await jumpActionSeed(prisma);
  await colorActionSeed(prisma);
  await growActionSeed(prisma);
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
