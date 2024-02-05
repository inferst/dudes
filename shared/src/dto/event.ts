import { UserInfo } from "./user";

export type RaidData = {
  broadcaster: {
    id: string;
    info: UserInfo;
  };
  viewers: number;
}

export type RewardRedemptionData = {
  rewardId: string;
  userId: string;
  userDisplayName: string;
  input: string;
}
