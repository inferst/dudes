import { PrismaClient, SkinCollection } from '@prisma/client';

export async function skinCollectionSeed(
  prisma: PrismaClient,
  name: string
): Promise<SkinCollection> {
  const collection = await prisma.skinCollection.upsert({
    where: { name },
    update: {},
    create: {
      name,
    },
  });

  console.log({
    collection,
  });

  return collection;
}

export async function defaultUserSkinCollection(
  prisma: PrismaClient,
  userId: number
): Promise<void> {
  const collection = await prisma.skinCollection.findFirst({
    where: {
      name: 'dudes',
    },
  });

  if (collection) {
    await prisma.userSkinCollection.upsert({
      where: {
        skinCollectionId_userId: {
          userId,
          skinCollectionId: collection.id,
        },
      },
      update: {},
      create: {
        userId,
        skinCollectionId: collection.id,
        isActive: true,
        isDefault: true,
      },
    });
  }
}
