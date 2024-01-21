import { PrismaClient } from '@prisma/client';

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

  console.log({ jumpAction, colorAction });
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
