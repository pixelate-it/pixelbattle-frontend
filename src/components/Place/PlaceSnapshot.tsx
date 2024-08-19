import { SnapshotManager } from "../../managers/snapshot";
import { WHITE_TEXTURE } from "../../lib/WhiteTexture";
import { Sprite } from "@pixi/sprite";
import { PlaceManager } from "../../managers/place";
import { config } from "../../config";
import { Point } from "@pixi/math";

export class PlaceSnapshot extends Sprite {
	constructor() {
		super();

		this.setup();
	}

	private setup() {
		this.texture = WHITE_TEXTURE;
		this.visible = false;
		this.alpha = 0.5;

		SnapshotManager.enable.subscribe((v) => (this.visible = true));
		SnapshotManager.offsetPoint.subscribe((v) => {
			this.x = v.x;
			this.y = v.y;
			const ov = SnapshotManager.startPoint.value;
			if (this.x === 0) {
				this.x = ov.x;
			}
			if (this.y === 0) {
				this.y = ov.y;
			}
		});
		SnapshotManager.startPoint.subscribe((v) => {
			const ov = SnapshotManager.offsetPoint.value;
			this.x = v.x - ov.x;
			this.y = v.y - ov.y;
			const i = PlaceManager.image.value;
			if (i) this.tint = i.getPixel(v).getReadableColor();
		});

		SnapshotManager.size.subscribe((v) => {
			this.width = Math.abs(v.x);
			this.height = Math.abs(v.y);
		});
	}
}
