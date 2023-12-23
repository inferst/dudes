import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@app/backend-api/database/prisma.service';

export type User = Required<Prisma.UserUncheckedCreateInput>;

type Credentials = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class UserRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async getUserByGuid(guid: string): Promise<User | null> {
    return this.prismaService.user.findFirst({
      where: {
        guid,
      },
    });
  }

  public async getUserById(userId: number): Promise<User> {
    return this.prismaService.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    });
  }

  public async updateCredentials(
    userId: number,
    credentials: Credentials
  ): Promise<User> {
    return this.prismaService.user.update({
      data: credentials,
      where: {
        id: userId,
      },
    });
  }
}
