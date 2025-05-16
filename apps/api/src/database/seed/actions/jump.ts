import { PrismaClient } from '@repo/database';
import { defaultJumpCommandSeed } from '../commands/jump';

export async function jumpActionSeed(prisma: PrismaClient): Promise<void> {
  const jumpAction = await prisma.action.upsert({
    where: { name: 'jump' },
    update: {},
    create: {
      name: 'jump',
      title: 'Jump',
      description: 'Jump',
    },
  });

  // Create non existing command based on actions for each user

  const users = await prisma.user.findMany();

  for (const user of users) {
    await defaultJumpCommandSeed(prisma, user, jumpAction);
  }

  console.log({
    jumpAction,
  });
}
