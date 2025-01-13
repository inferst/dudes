import { Auth } from '@app/backend-api/auth/decorators';
import { AuthGuard } from '@app/backend-api/auth/guards';
import { AuthUserProps } from '@app/backend-api/auth/services/auth.service';
import { ZodPipe } from '@app/backend-api/pipes/zod.pipe';
import {
  UpdateUserSkinDto,
  UserSkinEntity,
  updateUserSkinDtoSchema,
} from '@lib/types';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserSkinRepository } from '../repositories/user-skin.repository';

@Controller('/user-skin')
export class UserSkinController {
  public constructor(private readonly userSkinRepository: UserSkinRepository) {}

  @Get('/list')
  @UseGuards(AuthGuard)
  public async getChatters(
    @Auth() user: AuthUserProps,
    collectionId: number
  ): Promise<UserSkinEntity[]> {
    return this.userSkinRepository.getUserSkinsByUserId(
      user.userId,
      collectionId
    );
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Auth() user: AuthUserProps,
    @Body(new ZodPipe(updateUserSkinDtoSchema)) userSkin: UpdateUserSkinDto
  ): Promise<UserSkinEntity> {
    return this.userSkinRepository.update(user.userId, id, userSkin.isActive);
  }
}
