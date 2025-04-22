import { PrismaClient, SkinCollection } from '../../client';

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

export async function defaultUserSkins(
  prisma: PrismaClient,
  userId: number
): Promise<void> {
  const skins = await prisma.skin.findMany({
    where: {
      collection: {
        name: 'dudes',
      },
    },
  });

  for (const skin of skins) {
    await prisma.userSkin.upsert({
      where: {
        skinId_userId: {
          userId,
          skinId: skin.id,
        },
      },
      update: {},
      create: {
        userId,
        skinId: skin.id,
        isActive: true,
        isDefault: skin.name == 'dude',
      },
    });
  }
}
