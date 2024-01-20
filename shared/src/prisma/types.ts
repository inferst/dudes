declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace PrismaJson {
    type SettingsData = {
      showAnonymousDudes?: boolean;
      fallingDudes?: boolean;
    };
  }
}

export {};
