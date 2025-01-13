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
