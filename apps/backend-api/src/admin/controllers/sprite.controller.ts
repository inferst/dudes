import { ConfigService } from '@app/backend-api/config/config.service';
import { ZodPipe } from '@app/backend-api/pipes/zod.pipe';
import { Body, Controller, Post } from '@nestjs/common';
import { existsSync, readFileSync, readdirSync } from 'fs';
import { z } from 'zod';
import { UserRepository } from '../repositories';
import { SettingsRepository } from '../repositories/settings.repository';
import { SpriteService } from '../services';

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
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly settingsRepository: SettingsRepository,
    private readonly spriteService: SpriteService
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

  private getFileData(src: string): any {
    return JSON.parse(readFileSync(src).toString());
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

    const sprite = this.getFileData(spriteSrc);
    const data = this.getFileData(dataSrc);

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

    const spriteName = this.spriteService.findSetSprite('tech', name);

    if (!spriteName) {
      return;
    }

    const fileName = files.find((file: string) => file == spriteName + '.png');

    const path = this.configService.clientUrl + '/tech';

    const sprite = this.getFileData(spriteSrc);
    const data = this.getFileData(dataSrc);

    const image = path + '/' + fileName;

    return {
      data: data,
      image: image,
      sprite: sprite,
    };
  }
}
