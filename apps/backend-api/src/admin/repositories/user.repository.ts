import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@app/backend-api/database/prisma.service';

export type User = Required<Prisma.UserUncheckedCreateInput>;

@Injectable()
export class UserRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async getUserByGuid(guid: string): Promise<User> {
    return this.prismaService.user.findFirst({
      where: {
        guid,
      },
    });
  }
}
