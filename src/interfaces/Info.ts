export interface ApiInfo {
    name: string;
    cooldown: number;
    size: {
        width: number;
        height: number;
    }
    players: {
        online: number;
        total: number;
    }
}