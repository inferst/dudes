import { Auth } from '@/auth/decorators';
import { AuthGuard } from '@/auth/guards';
import { AuthUserProps } from '@/auth/services/auth.service';
import { ZodPipe } from '@/pipes/zod.pipe';
import {
  UpdateUserSkinCollectionDto,
  UserSkinCollectionEntity,
  updateUserSkinCollectionDtoSchema,
} from '@repo/types';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserSkinCollectionService } from '../services/user-skin-collection.service';

@Controller('/user-skin-collection')
export class UserSkinCollectionController {
  public constructor(
    private readonly userSkinService: UserSkinCollectionService,
  ) {}

  @Get('/list')
  @UseGuards(AuthGuard)
  public async getChatters(
    @Auth() user: AuthUserProps,
  ): Promise<UserSkinCollectionEntity[]> {
    return this.userSkinService.getUserSkinCollectionsByUserId(user.userId);
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Auth() user: AuthUserProps,
    @Body(new ZodPipe(updateUserSkinCollectionDtoSchema))
    data: UpdateUserSkinCollectionDto,
  ): Promise<UserSkinCollectionEntity> {
    return this.userSkinService.update(user.userId, id, data);
  }
}
