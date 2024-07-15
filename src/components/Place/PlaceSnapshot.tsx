import { SnapshotManager } from "../../managers/snapshot"
import { WHITE_TEXTURE } from "../../lib/WhiteTexture"
import { Sprite } from "@pixi/sprite"

export class PlaceSnapshot extends Sprite {
	constructor() {
		super()
		this.setup()
	}

	private setup() {
		this.texture = WHITE_TEXTURE
		this.visible = false
		this.alpha = 0.5

		SnapshotManager.active.subscribe((v) => (this.visible = v))
		SnapshotManager.pos.subscribe((v) => {
			this.x = v.x
			this.y = v.y
		})
		SnapshotManager.size.subscribe((v) => {
			this.width = Math.abs(v.x)
			this.height = Math.abs(v.y)
			this.anchor.set(v.x > 0 ? 0 : 1, v.y > 0 ? 0 : 1)
		})
	}
}
