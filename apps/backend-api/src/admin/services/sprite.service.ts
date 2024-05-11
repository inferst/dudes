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

  public findSetSprite(
    setName: string,
    spriteName: string
  ): string | undefined {
    try {
      const src = `apps/frontend-client/public/${setName}/set.json`;
      const file = readFileSync(src);
      const set = JSON.parse(file.toString()) as string[];

      const regexp = /[&\/\\#, ()$~%.'":*?<>{}-]/g;

      const name = spriteName.toLowerCase().replace(regexp, '');

      set.sort();

      for (const setSprite of set) {
        const filteredName = setSprite.toLowerCase().replace(regexp, '');

        if (filteredName.startsWith(name)) {
          console.log(setSprite, filteredName, name);
          return setSprite;
        }
      }

      for (const setSprite of set) {
        const filteredName = setSprite.toLowerCase().replace(regexp, '');

        if (filteredName.includes(name)) {
          return setSprite;
        }
      }
    } catch (e) {
      return;
    }
  }

  private setContainsSprite(setName: string, spriteName: string): boolean {
    return !!this.findSetSprite(setName, spriteName);
  }
}
