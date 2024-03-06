export type SoundManifest = {
  [key: string]: string;
};

class SoundService {
  assets: { [key: string]: HTMLAudioElement } = {};

  async init(manifest: SoundManifest) {
    this.assets = Object.fromEntries(
      Array.from(Object.entries(manifest)).map(([key, value]) => {
        return [key, new Audio(value)];
      })
    );
  }

  play(name: string) {
    const audio = this.assets[name];

    if (audio) {
      audio.volume = 0.2;
      audio.pause();
      audio.currentTime = 0;
      audio.play();
    }
  }
}

export const soundService = new SoundService();
