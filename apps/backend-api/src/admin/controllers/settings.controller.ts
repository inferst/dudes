import { Auth } from '@/auth/decorators';
import { AuthGuard } from '@/auth/guards';
import { AuthUserProps } from '@/auth/services/auth.service';
import { ZodPipe } from '@/pipes/zod.pipe';
import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { SettingsRepository } from '../repositories/settings.repository';
import {
  SettingsEntity,
  UpdateSettingsDto,
  updateSettingsDtoSchema,
} from '@repo/types';

@Controller('/settings')
export class SettingsController {
  public constructor(private readonly settingsRepository: SettingsRepository) {}

  @Get()
  @UseGuards(AuthGuard)
  public async getSettings(
    @Auth() user: AuthUserProps,
  ): Promise<SettingsEntity> {
    const settings = await this.settingsRepository.get(user.userId);
    return settings.data;
  }

  @Put()
  @UseGuards(AuthGuard)
  public async update(
    @Auth() user: AuthUserProps,
    @Body(new ZodPipe(updateSettingsDtoSchema)) data: UpdateSettingsDto,
  ): Promise<SettingsEntity> {
    const settings = await this.settingsRepository.update(user.userId, {
      data,
    });

    return settings.data;
  }
}
