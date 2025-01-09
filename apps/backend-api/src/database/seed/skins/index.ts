import { PrismaClient, Skin, SkinCollection, User } from '@prisma/client';
import { dudeSkins } from './skins';

export async function skinSeed(prisma: PrismaClient): Promise<void> {
  const dudeCollection = await collectionSeed(prisma, 'dudes');
  skinsSeed(prisma, dudeSkins, dudeCollection);
}

export async function defaultSkins(
  prisma: PrismaClient,
  user: User
): Promise<void> {
  const collections = await prisma.skinCollection.findMany();

  for (const collection of collections) {
    defaulCollection(prisma, user, collection);
  }

  const skins = await prisma.skin.findMany();

  for (const skin of skins) {
    defaultSkin(prisma, user, skin);
  }
}

export async function defaultSkin(
  prisma: PrismaClient,
  user: User,
  skin: Skin
): Promise<void> {
  const userSkin = await prisma.userSkin.findFirst({
    where: {
      user,
      skin,
    },
  });

  if (!userSkin) {
    await prisma.userSkin.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        isActive: true,
        skin: {
          connect: {
            id: skin.id,
          },
        },
      },
    });
  }
}

export async function defaulCollection(
  prisma: PrismaClient,
  user: User,
  collection: SkinCollection
): Promise<void> {
  const userSkinCollection = await prisma.userSkinCollection.findFirst({
    where: {
      user,
      skinCollection: collection,
    },
  });

  if (!userSkinCollection) {
    await prisma.userSkinCollection.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        isActive: true,
        skinCollection: {
          connect: {
            id: collection.id,
          },
        },
      },
    });
  }
}

export async function skinsSeed(
  prisma: PrismaClient,
  skins: string[],
  collection: SkinCollection
): Promise<void> {
  const users = await prisma.user.findMany();

  for (const name of skins) {
    const skin = await prisma.skin.upsert({
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

    for (const user of users) {
      await defaultSkin(prisma, user, skin);
    }
  }
}

export async function collectionSeed(
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

  const users = await prisma.user.findMany();

  for (const user of users) {
    await defaulCollection(prisma, user, collection);
  }

  console.log({
    collection,
  });

  return collection;
}
