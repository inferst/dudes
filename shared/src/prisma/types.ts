declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace PrismaJson {
    type SettingsData = {
      showAnonymousDudes?: boolean;
      fallingDudes?: boolean;
    };

    type ActionData = Record<string, string | number | undefined>;

    type CommandData = {
      arguments: string[];
      action: ActionData;
    };

    type RewardData = {
      arguments: string[];
      action: ActionData;
    };
  }
}

export {};
