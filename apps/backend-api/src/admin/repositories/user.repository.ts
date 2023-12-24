import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/backend-api/database/prisma.service';
import { Prisma } from '@prisma/client';

export type User = Required<Prisma.UserUncheckedCreateInput>;

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

  public async patch(
    userId: number,
    data: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>
  ): Promise<User> {
    return this.prismaService.user.update({
      data,
      where: {
        id: userId,
      },
    });
  }
}
