import { PrismaClient } from '../../client';
import { defaultUserSkinCollection, skinCollectionSeed } from './collection';
import { skins } from './dudes';
import { defaultUserSkins, skinSeed } from './skin';

export async function dudesSkinCollectionSeed(
  prisma: PrismaClient,
): Promise<void> {
  const collection = await skinCollectionSeed(prisma, 'dudes');

  for (const name of skins) {
    skinSeed(prisma, name, collection);
  }

  const users = await prisma.user.findMany();

  for (const user of users) {
    await defaultUserSkinCollection(prisma, user.id);
    await defaultUserSkins(prisma, user.id);
  }
}
