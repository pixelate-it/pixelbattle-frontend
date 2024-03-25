export type DiscordUserId = string;

export interface ProfileInfo {
	userID: DiscordUserId;
	cooldown: number;
	tag: string | null;
	banned: BanInfo | null;
	username: string;
	role: UserRole;
    points: number;
}

export enum UserRole {
    User = 0,
    Moderator = 1,
    Admin = 2
}

export interface BanInfo {
    moderatorID: DiscordUserId;
    timeout: number;
    reason: string | null;
}