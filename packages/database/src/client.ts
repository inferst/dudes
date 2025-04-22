import { PrismaClient } from '../generated/client';

// const globalForPrisma = global as unknown as { prisma: PrismaClient };
//
// export const prisma =
//   globalForPrisma.prisma || new PrismaClient();
//
// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const prisma = new PrismaClient();

declare global {
  namespace PrismaJson {
    type SettingsData = {
      showAnonymousDudes?: boolean;
      fallingDudes?: boolean;
      fallingRaiders?: boolean;
      hiddenUsers?: string;
    };

    type ActionData = Record<string, string | number | undefined>;

    type ActionableData = {
      arguments: string[];
      action: ActionData;
    };
  }
}

export * from '../generated/client';
