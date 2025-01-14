import { PrismaService } from '@app/backend-api/database/prisma.service';
import { defaultColorCommandSeed } from '@app/backend-api/database/seed/commands/color';
import { defaultDashCommandSeed } from '@app/backend-api/database/seed/commands/dash';
import { defaultGrowCommandSeed } from '@app/backend-api/database/seed/commands/grow';
import { defaultJumpCommandSeed } from '@app/backend-api/database/seed/commands/jump';
import { defaultSpriteCommandSeed } from '@app/backend-api/database/seed/commands/sprite';
import { defaultUserSkinCollection } from '@app/backend-api/database/seed/skins/collection';
import { defaultUserSkins } from '@app/backend-api/database/seed/skins/skin';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

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
    Promise.all([
      this.createDefaultCommands(user),
      defaultUserSkinCollection(this.prismaService, user.id),
      defaultUserSkins(this.prismaService, user.id),
    ]);
  }
}
