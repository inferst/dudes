import { Action, PrismaClient, User } from '@prisma/client';

export async function defaultGrowCommandSeed(
  prisma: PrismaClient,
  user: User,
  action?: Action
): Promise<void> {
  const growAction =
    action ??
    (await prisma.action.findFirst({
      where: { name: 'grow' },
    }));

  // Create non existing command based on actions for each user

  if (!growAction) {
    return;
  }

  const foundGrowCommand = await prisma.command.findFirst({
    where: {
      user: {
        id: user.id,
      },
      action: {
        id: growAction.id,
      },
    },
  });

  if (!foundGrowCommand) {
    await prisma.command.create({
      data: {
        text: `!grow`,
        cooldown: 20,
        isActive: true,
        action: {
          connect: {
            id: growAction.id,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
        data: {
          action: {
            duration: 10,
            scale: 2,
          },
          arguments: []
        }
      },
    });
  }
}
