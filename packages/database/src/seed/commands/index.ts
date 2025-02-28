import { PrismaClient, User } from '../../client';
import { defaultColorCommandSeed } from './color';
import { defaultDashCommandSeed } from './dash';
import { defaultGrowCommandSeed } from './grow';
import { defaultJumpCommandSeed } from './jump';
import { defaultSpriteCommandSeed } from './sprite';

export const defaultCommandsSeed = async (
  prisma: PrismaClient,
  user: User
): Promise<void> => {
  await defaultJumpCommandSeed(prisma, user);
  await defaultColorCommandSeed(prisma, user);
  await defaultGrowCommandSeed(prisma, user);
  await defaultDashCommandSeed(prisma, user);
  await defaultSpriteCommandSeed(prisma, user);
};
