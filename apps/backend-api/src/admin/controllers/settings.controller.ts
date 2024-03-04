import { Auth } from '@app/backend-api/auth/decorators';
import { AuthGuard } from '@app/backend-api/auth/guards';
import { AuthUserProps } from '@app/backend-api/auth/services/auth.service';
import { ZodPipe } from '@app/backend-api/pipes/zod.pipe';
import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { SettingsRepository } from '../repositories/settings.repository';
import { SettingsEntity, UpdateSettingsDto, updateSettingsDtoSchema } from '@libs/types';

@Controller('/settings')
export class SettingsController {
  public constructor(private readonly settingsRepository: SettingsRepository) {}

  @Get()
  @UseGuards(AuthGuard)
  public async getSettings(
    @Auth() user: AuthUserProps
  ): Promise<SettingsEntity> {
    const settings = await this.settingsRepository.get(user.userId);
    return settings.data;
  }

  @Put()
  @UseGuards(AuthGuard)
  public async update(
    @Auth() user: AuthUserProps,
    @Body(new ZodPipe(updateSettingsDtoSchema)) data: UpdateSettingsDto
  ): Promise<SettingsEntity> {
    const settings = await this.settingsRepository.update(user.userId, {
      data,
    });

    return settings.data;
  }
}
