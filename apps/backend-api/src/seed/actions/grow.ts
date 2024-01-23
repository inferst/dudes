import { PrismaClient } from '@prisma/client';
import { defaultGrowCommandSeed } from '../commands/grow';

export async function growActionSeed(prisma: PrismaClient): Promise<void> {
  const growAction = await prisma.action.upsert({
    where: { name: 'grow' },
    update: {},
    create: {
      name: 'grow',
      title: 'Grow',
      description: 'Grow',
    },
  });

  // Create non existing command based on actions for each user

  const users = await prisma.user.findMany();

  for (const user of users) {
    await defaultGrowCommandSeed(prisma, user, growAction);
  }

  console.log({
    growAction,
  });
}
