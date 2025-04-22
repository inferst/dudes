import { PrismaClient, User } from '@repo/database';
import { defaultJumpCommandSeed } from './jump';
import { defaultColorCommandSeed } from './color';
import { defaultGrowCommandSeed } from './grow';
import { defaultDashCommandSeed } from './dash';
import { defaultSpriteCommandSeed } from './sprite';

export const defaultCommandsSeed = async (
  prisma: PrismaClient,
  user: User,
): Promise<void> => {
  await defaultJumpCommandSeed(prisma, user);
  await defaultColorCommandSeed(prisma, user);
  await defaultGrowCommandSeed(prisma, user);
  await defaultDashCommandSeed(prisma, user);
  await defaultSpriteCommandSeed(prisma, user);
};
