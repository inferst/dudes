import { PrismaClient } from '@repo/database';
import { defaultDashCommandSeed } from '../commands/dash';

export async function dashActionSeed(prisma: PrismaClient): Promise<void> {
  const dashAction = await prisma.action.upsert({
    where: { name: 'dash' },
    update: {},
    create: {
      name: 'dash',
      title: 'Dash',
      description: 'Dash',
    },
  });

  // Create non existing command based on actions for each user

  const users = await prisma.user.findMany();

  for (const user of users) {
    await defaultDashCommandSeed(prisma, user, dashAction);
  }

  console.log({
    dashAction,
  });
}
