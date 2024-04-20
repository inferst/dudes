import { Action, PrismaClient, User } from '@prisma/client';

export async function defaultDashCommandSeed(
  prisma: PrismaClient,
  user: User,
  action?: Action
): Promise<void> {
  const dashAction =
    action ??
    (await prisma.action.findFirst({
      where: { name: 'dash' },
    }));

  // Create non existing command based on actions for each user

  if (!dashAction) {
    return;
  }

  const foundDashCommand = await prisma.command.findFirst({
    where: {
      user: {
        id: user.id,
      },
      action: {
        id: dashAction.id,
      },
    },
  });

  if (!foundDashCommand) {
    await prisma.command.create({
      data: {
        text: `!dash`,
        cooldown: 0,
        isActive: true,
        action: {
          connect: {
            id: dashAction.id,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
        data: {
          action: {
            force: 14,
          },
          arguments: []
        }
      },
    });
  }
}
