import { PrismaClient } from '@prisma/client';

export async function addJumpHitsActionSeed(
  prisma: PrismaClient
): Promise<void> {
  const addJumpHitsAction = await prisma.action.upsert({
    where: { name: 'add_jump_hits' },
    update: {},
    create: {
      name: 'add_jump_hits',
      title: 'Add Jump Hits',
      description: 'Add Jump Hits',
    },
  });

  console.log({
    spriteAction: addJumpHitsAction,
  });
}
