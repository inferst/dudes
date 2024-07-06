import { PrismaClient } from '@prisma/client';

export async function resurrectActionSeed(prisma: PrismaClient): Promise<void> {
  const spriteAction = await prisma.action.upsert({
    where: { name: 'resurrect' },
    update: {},
    create: {
      name: 'resurrect',
      title: 'Resurrect',
      description: 'Resurrect',
    },
  });

  console.log({
    spriteAction,
  });
}
