import { PrismaClient, SkinCollection } from '@prisma/client';

export async function skinSeed(
  prisma: PrismaClient,
  name: string,
  collection: SkinCollection
): Promise<void> {
  await prisma.skin.upsert({
    where: {
      collectionId_name: {
        collectionId: collection.id,
        name,
      },
    },
    update: {},
    create: {
      name,
      collection: {
        connect: {
          id: collection.id,
        },
      },
    },
  });
}
