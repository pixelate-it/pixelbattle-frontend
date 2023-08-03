import { Color } from "pixi.js";
import { AuthController } from "./api/auth";
import { PaletteController } from "./api/palette";
import { InfoController } from "./api/info";
import { RequestController } from "./api/request";
import { WebSocketController } from "./api/socket";
import { TagsController } from "./api/tag";
import { config } from "./config";
import { Game } from "./game/game";
import { ProfileController } from "./api/profile";

export namespace app {
    export const auth = new AuthController();
    export const palette = new PaletteController();
    export const game = new Game();
    export const request = new RequestController();
    export const tags = new TagsController();
    export const profile = new ProfileController();
    export const info = new InfoController();
    export const ws = new WebSocketController();
}

// export const app = new App();
