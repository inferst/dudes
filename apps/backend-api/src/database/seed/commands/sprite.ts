import { Action, PrismaClient, User } from '@prisma/client';

export async function defaultSpriteCommandSeed(
  prisma: PrismaClient,
  user: User,
  action?: Action
): Promise<void> {
  const spriteAction =
    action ??
    (await prisma.action.findFirst({
      where: { name: 'sprite' },
    }));

  if (!spriteAction) {
    return;
  }

  const foundSpriteCommand = await prisma.command.findFirst({
    where: {
      user: {
        id: user.id,
      },
      action: {
        id: spriteAction.id,
      },
    },
  });

  if (!foundSpriteCommand) {
    await prisma.command.create({
      data: {
        text: `!sprite`,
        cooldown: 0,
        isActive: true,
        action: {
          connect: {
            id: spriteAction.id,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
        data: {
          arguments: ['sprite'],
          action: {},
        },
      },
    });
  }
}
