import { Auth } from '@app/backend-api/auth/decorators';
import { AuthGuard } from '@app/backend-api/auth/guards';
import { AuthUserProps } from '@app/backend-api/auth/services/auth.service';
import { ZodPipe } from '@app/backend-api/pipes/zod.pipe';
import {
  UpdateUserSkinCollectionDto,
  UserSkinCollectionEntity,
  updateUserSkinCollectionDtoSchema,
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
import { UserSkinCollectionRepository } from '../repositories';

@Controller('/user-skin-collection')
export class UserSkinCollectionController {
  public constructor(
    private readonly userSkinRepository: UserSkinCollectionRepository
  ) {}

  @Get('/list')
  @UseGuards(AuthGuard)
  public async getChatters(
    @Auth() user: AuthUserProps
  ): Promise<UserSkinCollectionEntity[]> {
    return this.userSkinRepository.getUserSkinCollectionsByUserId(user.userId);
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Auth() user: AuthUserProps,
    @Body(new ZodPipe(updateUserSkinCollectionDtoSchema))
    userSkinCollection: UpdateUserSkinCollectionDto
  ): Promise<UserSkinCollectionEntity> {
    return this.userSkinRepository.update(
      user.userId,
      id,
      userSkinCollection.isActive
    );
  }
}
