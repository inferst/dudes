import { PrismaClient, User } from "@prisma/client"
import { defaultJumpCommandSeed } from "./jump"
import { defaultColorCommandSeed } from "./color";
import { defaultGrowCommandSeed } from "./grow";
import { defaultDashCommandSeed } from "./dash";

export const defaultCommandsSeed = async (prisma: PrismaClient, user: User): Promise<void> => {
  await defaultJumpCommandSeed(prisma, user);
  await defaultColorCommandSeed(prisma, user);
  await defaultGrowCommandSeed(prisma, user);
  await defaultDashCommandSeed(prisma, user);
}
