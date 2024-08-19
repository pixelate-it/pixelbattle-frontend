import { SnapshotManager } from "../../managers/snapshot";
import { WHITE_TEXTURE } from "../../lib/WhiteTexture";
import { Sprite } from "@pixi/sprite";
import { PlaceManager } from "../../managers/place";
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

		SnapshotManager.enable.subscribe((v) => (this.visible = v));
		SnapshotManager.offsetPoint.subscribe((v: Point) => {
			const ov = SnapshotManager.startPoint.value;
			if (Number.isNaN(v.x)) {
				this.x = ov.x;
			} else {
				this.x = v.x;
			}
			if (Number.isNaN(v.y)) {
				this.y = ov.y;
			} else {
				this.y = v.y;
			}
		});
		SnapshotManager.startPoint.subscribe((v) => {
			const ov = SnapshotManager.offsetPoint.value;
			this.x = !Number.isNaN(ov.x) ? v.x - ov.x : v.x;
			this.y = !Number.isNaN(ov.y) ? v.y - ov.y : v.y;
			const i = PlaceManager.image.value;
			if (i) this.tint = i.getPixel(v).getReadableColor();
		});

		SnapshotManager.size.subscribe((v) => {
			this.width = Math.abs(v.x);
			this.height = Math.abs(v.y);
		});
	}
}
