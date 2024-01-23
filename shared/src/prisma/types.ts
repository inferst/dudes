declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace PrismaJson {
    type SettingsData = {
      showAnonymousDudes?: boolean;
      fallingDudes?: boolean;
    };

    type ActionData = Record<string, unknown>;

    type CommandData = {
      arguments: string[];
      action: ActionData;
    };
  }
}

export {};
