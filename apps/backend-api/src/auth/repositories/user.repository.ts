import { PrismaService } from '@app/backend-api/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class UserRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async getByIdOrCreate(id: number): Promise<User> {
    const user = await this.prismaService.user.upsert({
      where: {
        id,
      },
      update: {},
      create: {},
    });

    return user;
  }
}
