import { ConfigService } from '@app/backend-api/config/config.service';
import { ZodPipe } from '@app/backend-api/pipes/zod.pipe';
import { HttpService } from '@nestjs/axios';
import { Body, Controller, Post } from '@nestjs/common';
import { existsSync, readFileSync, readdirSync } from 'fs';
import { firstValueFrom } from 'rxjs';
import { z } from 'zod';
import { UserRepository } from '../repositories';
import { SettingsRepository } from '../repositories/settings.repository';

type SpriteDto = {
  guid: string;
  sprite: string;
};

export const spriteDtoSchema = z
  .object({
    guid: z.string().min(1).max(255),
    sprite: z.string().min(1).max(255),
  })
  .strict();

@Controller('/sprite')
export class SpriteController {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly settingsRepository: SettingsRepository
  ) {}

  @Post()
  public async getSprite(
    @Body(new ZodPipe(spriteDtoSchema)) body: SpriteDto
  ): Promise<any> {
    const user = await this.userRepository.getUserByGuid(body.guid);

    if (!user) {
      return;
    }

    const settings = await this.settingsRepository.get(user.id);

    const providers: Record<string, any> = {
      dudes: this.getDudeSpriteData.bind(this),
      tech: this.getTechSpriteData.bind(this),
    };

    for (const set of settings.data.sprites?.sets ?? []) {
      const fn = providers[set];

      if (fn) {
        const data = await fn(body.sprite);

        if (data) {
          return data;
        }
      }
    }

    return await this.getDudeSpriteData(body.sprite);
  }

  private async getDudeSpriteData(name: string): Promise<any> {
    const src = 'apps/frontend-client/public/evotars/';
    let spriteName = name;

    let spriteSrc = src + spriteName + '/sprite.json';
    let dataSrc = src + spriteName + '/data.json';

    if (!existsSync(spriteSrc) || !existsSync(dataSrc)) {
      spriteName = 'dude';

      spriteSrc = src + spriteName + '/sprite.json';
      dataSrc = src + spriteName + '/data.json';
    }

    const path = this.configService.clientUrl + '/evotars/' + spriteName;

    const spriteFile = readFileSync(spriteSrc);
    const sprite = JSON.parse(spriteFile.toString());

    const dataFile = readFileSync(dataSrc);
    const data = JSON.parse(dataFile.toString());

    console.log(spriteSrc, dataSrc);

    return {
      data: data,
      image: path + '/sprite.png',
      sprite: sprite,
    };
  }

  private async getTechSpriteData(name: string): Promise<any> {
    const src = 'apps/frontend-client/public/tech';
    const spriteSrc = src + '/sprite.json';
    const dataSrc = src + '/data.json';

    if (!existsSync(spriteSrc) || !existsSync(dataSrc)) {
      return;
    }

    const files = readdirSync(src);

    const fileName =
      files.find((file: string) =>
        file.toLowerCase().startsWith(name.toLowerCase())
      ) ?? 'tech.png';

    const path = this.configService.clientUrl + '/tech';

    const spriteFile = readFileSync(spriteSrc);
    const sprite = JSON.parse(spriteFile.toString());

    const dataFile = readFileSync(dataSrc);
    const data = JSON.parse(dataFile.toString());

    return {
      data: data.data,
      image: path + '/' + fileName,
      sprite: sprite.data,
    };
  }
}
