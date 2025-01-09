import { PrismaClient } from '@prisma/client';
import { addJumpHitsActionSeed } from './add_jump_hits';
import { colorActionSeed } from './color';
import { dashActionSeed } from './dash';
import { growActionSeed } from './grow';
import { jumpActionSeed } from './jump';
import { resurrectActionSeed } from './resurrect';
import { spriteActionSeed } from './sprite';

export async function actionSeed(prisma: PrismaClient): Promise<void> {
  await jumpActionSeed(prisma);
  await colorActionSeed(prisma);
  await growActionSeed(prisma);
  await dashActionSeed(prisma);
  await spriteActionSeed(prisma);
  await addJumpHitsActionSeed(prisma);
  await resurrectActionSeed(prisma);
}
