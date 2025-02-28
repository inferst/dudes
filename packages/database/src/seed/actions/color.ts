import { PrismaClient } from '../../client';
import { defaultColorCommandSeed } from '../commands/color';

export async function colorActionSeed(prisma: PrismaClient): Promise<void> {
  const colorAction = await prisma.action.upsert({
    where: { name: 'color' },
    update: {},
    create: {
      name: 'color',
      title: 'Color',
      description: 'Color',
    },
  });

  const users = await prisma.user.findMany();

  for (const user of users) {
    await defaultColorCommandSeed(prisma, user, colorAction);
  }

  console.log({
    colorAction,
  });
}
