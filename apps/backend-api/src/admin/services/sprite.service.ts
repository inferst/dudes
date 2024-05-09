import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { SettingsRepository } from '../repositories/settings.repository';

@Injectable()
export class SpriteService {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  public async isSpriteAvailable(
    userId: number,
    spriteName: string
  ): Promise<boolean> {
    const settings = await this.settingsRepository.get(userId);
    const sets = settings.data.sprites?.sets ?? [];

    if (sets.includes('tech')) {
      if (this.setContainsSprite('tech', spriteName)) {
        return true;
      }
    }

    return this.setContainsSprite('evotars', spriteName);
  }

  private setContainsSprite(setName: string, spriteName: string): boolean {
    try {
      const src = 'apps/frontend-client/public/' + setName + '/set.json';
      const file = readFileSync(src);
      const set = JSON.parse(file.toString());

      return set.includes(spriteName);
    } catch (e) {
      return false;
    }
  }
}
