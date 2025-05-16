import { PrismaService } from '@/database/prisma.service';
import { defaultColorCommandSeed } from '@/database/seed/commands/color';
import { defaultDashCommandSeed } from '@/database/seed/commands/dash';
import { defaultGrowCommandSeed } from '@/database/seed/commands/grow';
import { defaultJumpCommandSeed } from '@/database/seed/commands/jump';
import { defaultSpriteCommandSeed } from '@/database/seed/commands/sprite';
import { defaultUserSkinCollection } from '@/database/seed/skins/collection';
import { defaultUserSkins } from '@/database/seed/skins/skin';
import { Injectable } from '@nestjs/common';
import { User } from '@repo/database';

@Injectable()
export class SeedService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async createDefaultCommands(user: User): Promise<void> {
    Promise.all([
      defaultJumpCommandSeed(this.prismaService, user),
      defaultColorCommandSeed(this.prismaService, user),
      defaultGrowCommandSeed(this.prismaService, user),
      defaultDashCommandSeed(this.prismaService, user),
      defaultSpriteCommandSeed(this.prismaService, user),
    ]);
  }

  public async createDefaultData(user: User): Promise<void> {
    Promise.all([])
    await this.createDefaultCommands(user);
    await defaultUserSkinCollection(this.prismaService, user.id);
    await defaultUserSkins(this.prismaService, user.id);
  }
}
