import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/backend-api/database/prisma.service';
import { User } from '@prisma/client';
import { defaultJumpCommandSeed } from '@app/backend-api/database/seed/commands/jump';
import { defaultColorCommandSeed } from '@app/backend-api/database/seed/commands/color';
import { defaultGrowCommandSeed } from '@app/backend-api/database/seed/commands/grow';

@Injectable()
export class SeedService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async createDefaultCommands(user: User): Promise<void> {
    await defaultJumpCommandSeed(this.prismaService, user);
    await defaultColorCommandSeed(this.prismaService, user);
    await defaultGrowCommandSeed(this.prismaService, user);
  }
}
