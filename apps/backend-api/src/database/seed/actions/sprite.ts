import { PrismaClient } from '@prisma/client';
import { defaultSpriteCommandSeed } from '../commands/sprite';

export async function spriteActionSeed(prisma: PrismaClient): Promise<void> {
  const spriteAction = await prisma.action.upsert({
    where: { name: 'sprite' },
    update: {},
    create: {
      name: 'sprite',
      title: 'Sprite',
      description: 'Sprite',
    },
  });

  const users = await prisma.user.findMany();

  for (const user of users) {
    await defaultSpriteCommandSeed(prisma, user, spriteAction);
  }

  console.log({
    spriteAction,
  });
}
