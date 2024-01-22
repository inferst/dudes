import { Command, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const jumpAction = await prisma.action.upsert({
    where: { name: 'jump' },
    update: {},
    create: {
      name: 'jump',
      title: 'Jump',
      description: 'Jump',
    },
  });

  const colorAction = await prisma.action.upsert({
    where: { name: 'color' },
    update: {},
    create: {
      name: 'color',
      title: 'Color',
      description: 'Color',
    },
  });

  const growAction = await prisma.action.upsert({
    where: { name: 'grow' },
    update: {},
    create: {
      name: 'grow',
      title: 'Grow',
      description: 'Grow',
      data: {
        scale: 4
      }
    },
  });

  // Create non existing command based on actions for each user

  const users = await prisma.user.findMany();

  const commands: Command[] = [];

  for (const user of users) {
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
      const jumpCommand = await prisma.command.create({
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

      commands.push(jumpCommand);
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
      const colorCommand = await prisma.command.create({
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

      commands.push(colorCommand);
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
      const command = await prisma.command.create({
        data: {
          text: `!grow`,
          cooldown: 0,
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
        },
      });

      commands.push(command);
    }
  }

  console.log({
    jumpAction,
    colorAction,
    createdCommands: commands.map((command) => ({
      id: command.id,
      userId: command.userId,
      actionId: command.actionId,
    })),
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
