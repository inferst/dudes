import { Action, PrismaClient, User } from '../../client';

export async function defaultColorCommandSeed(
  prisma: PrismaClient,
  user: User,
  action?: Action
): Promise<void> {
  const colorAction =
    action ??
    (await prisma.action.findFirst({
      where: { name: 'color' },
    }));

  if (!colorAction) {
    return;
  }

  const foundColorCommand = await prisma.command.findFirst({
    where: {
      user: {
        id: user.id,
      },
      action: {
        id: colorAction.id,
      },
    },
  });

  if (!foundColorCommand) {
    await prisma.command.create({
      data: {
        text: `!color`,
        cooldown: 0,
        isActive: true,
        action: {
          connect: {
            id: colorAction.id,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
        data: {
          arguments: ['color'],
          action: {},
        },
      },
    });
  }
}
