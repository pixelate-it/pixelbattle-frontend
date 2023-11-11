export interface ProfileInfo {
    // token: string,
	userID: string,
	cooldown: number,
	tag: string | null,
	banned: boolean,
	username: string
    isMod: boolean;
}