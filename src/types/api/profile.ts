export interface ProfileInfo {
  userID: string
  cooldown: number
  tag: string | null
  banned: BanInfo | null
  username: string
  role: UserRole
}

export enum UserRole {
  User = 0,
  Moderator = 1,
  Admin = 2
}

export interface BanInfo {
  moderatorID: string
  timeout: number
  reason: string | null
}
