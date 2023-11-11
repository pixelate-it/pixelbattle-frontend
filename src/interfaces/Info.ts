export interface ApiInfo {
    name: string;
    ended: boolean;
    cooldown: number;
    players: {
        online: number;
        total: number;
    }
}