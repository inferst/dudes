declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace PrismaJson {
    type SettingsData = {
      showAnonymousDudes?: boolean;
      fallingDudes?: boolean;
      fallingRaiders?: boolean;
      hiddenUsers?: string;
    };

    type ActionData = Record<string, string | number | undefined>;

    type ActionableData = {
      arguments: string[];
      action: ActionData;
    };
  }
}

export {};
