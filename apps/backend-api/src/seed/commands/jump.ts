import { Action, PrismaClient, User } from '@prisma/client';

export async function defaultJumpCommandSeed(
  prisma: PrismaClient,
  user: User,
  action?: Action
): Promise<void> {
  const jumpAction =
    action ??
    (await prisma.action.findFirst({
      where: { name: 'jump' },
    }));

  if (!jumpAction) {
    return;
  }

  // Create non existing command based on actions for each user

  const foundJumpCommand = await prisma.command.findFirst({
    where: {
      user: {
        id: user.id,
      },
      action: {
        id: jumpAction.id,
      },
    },
  });

  if (!foundJumpCommand) {
    await prisma.command.create({
      data: {
        text: `!jump`,
        cooldown: 0,
        isActive: true,
        action: {
          connect: {
            id: jumpAction.id,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }
}
