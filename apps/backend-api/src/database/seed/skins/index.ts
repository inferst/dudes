import { PrismaClient } from '@prisma/client';
import { skinCollectionSeed } from './collection';
import { skins } from './dudes';
import { skinSeed } from './skin';

export async function dudesSkinCollectionSeed(
  prisma: PrismaClient
): Promise<void> {
  const collection = await skinCollectionSeed(prisma, 'dudes');

  for (const name of skins) {
    skinSeed(prisma, name, collection);
  }
}
