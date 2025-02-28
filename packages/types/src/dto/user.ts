export type UserEntity = {
  userId: number;
  guid: string;
  displayName: string;
  profileImageUrl: string;
  previewUrl: string;
};

export type UserInfo = {
  displayName: string;
  sprite: string;
  color?: string;
};
