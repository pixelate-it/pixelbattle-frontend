import { Container } from "@pixi/display"
import { Point } from "@pixi/math"
import { AppColor } from "../../classes/AppColor"
import { PaletteManager } from "../../managers/palette"
import { PlacePointer } from "./PlacePointer"
import { PlaceView } from "./PlaceView"
import { CooldownManager } from "../../managers/cooldown"
import { CoordinatesManager } from "../../managers/coordinates"
import { ProfileManager } from "../../managers/profile"
import { Viewport } from "pixi-viewport"
import { PlaceManager } from "../../managers/place"
import { InfoManager } from "../../managers/info"
import { ColorPickerManager } from "../../managers/picker"
import { AppFetch } from "../../classes/AppFetch"
import { DragEvent } from "pixi-viewport/dist/types"
import { NotificationsManager } from "../../managers/notifications"
import { ClientNotificationMap } from "../../lib/notificationMap"
import { RefObject } from "preact"
import { config } from "../../config"
import { PlaceOverlay } from "./PlaceOverlay"
import { FederatedPointerEvent } from "@pixi/events"
import { OverlayManager } from "../../managers/overlay"
import { SnapshotManager } from "../../managers/snapshot"
import { PlaceSnapshot } from "./PlaceSnapshot"

type Reason = "Cooldown" | "Not logged" | "Game ended" | "Banned"

export class PlaceContainer extends Container {
	private pointer = new PlacePointer()
	private place = new PlaceView()
	private overlay = new PlaceOverlay()
	private snapshot = new PlaceSnapshot()

	private pixelInfo = {
		lastPoint: new Point(-1, -1),
		lastPointTimeout: -1,
		timeoutId: -1,
	}

	constructor(
		private viewport: Viewport,
		private canvasRef: RefObject<HTMLCanvasElement>
	) {
		super()

		this.setup()
	}

	public onClick(event: DragEvent) {
		const ev = event.event as FederatedPointerEvent
		const position = ev.getLocalPosition(this)
		const placePoint = new Point(Math.floor(position.x), Math.floor(position.y))
		const image = PlaceManager.image.value

		const overlayImage = OverlayManager.image.value
		const overlayPosition = OverlayManager.position.value

		if (image === null) return

		const isOutsideOfCanvas =
			placePoint.x < 0 ||
			placePoint.x > image.size.x ||
			placePoint.y < 0 ||
			placePoint.y > image.size.y
		if (isOutsideOfCanvas) {
			return
		}

		if (SnapshotManager.active.value) {
			SnapshotManager.toggleDrag(placePoint)
				? this.viewport.plugins.pause("drag")
				: this.viewport.plugins.resume("drag")
			return
		}

		if (overlayPosition === null || overlayImage === null) {
			this.place.onClick(placePoint, ev.button)
			return
		}

		const isOnTopOfOverlay =
			placePoint.x <= overlayImage.size.x + overlayPosition.x &&
			placePoint.x >= overlayPosition.x &&
			placePoint.y <= overlayImage.size.y + overlayPosition.y &&
			placePoint.y >= overlayPosition.y

		if (!isOnTopOfOverlay) {
			this.place.onClick(placePoint, ev.button)
			return
		}

		const overlayPoint = placePoint
			.clone()
			.set(placePoint.x - overlayPosition.x, placePoint.y - overlayPosition.y)
		const color = overlayImage.getPixel(overlayPoint)

		if (color.alpha === 0) {
			this.place.onClick(placePoint, ev.button)
			return
		}

		if (ev.button === 0) {
			if (ColorPickerManager.isEnabled.value) {
				this.onWillColorPick(color)
				return
			}

			return this.onWillPlace(placePoint)
		}

		if (ev.button === 2) {
			return this.onWillColorPick(color)
		}
	}

	public setup() {
		this.on("cant-place", this.onCantPlace.bind(this))

		this.viewport.on("drag-start", this.onDragStart.bind(this))
		this.viewport.on("drag-end", this.onDragEnd.bind(this))

		this.place.on("will-place", this.onWillPlace.bind(this))
		this.place.on("place", this.onPlace.bind(this))
		this.place.on("will-color-pick", this.onWillColorPick.bind(this))
		this.place.on("hover", this.onHover.bind(this))
		this.place.on("out", this.onOut.bind(this))

		this.addChild(this.place)
		this.addChild(this.overlay)
		this.addChild(this.snapshot)
		this.addChild(this.pointer)
	}

	public onDragStart(event: DragEvent) {
		if (this.canvasRef.current) this.canvasRef.current.style.cursor = "grabbing"
	}

	public onDragEnd(event: DragEvent) {
		if (this.canvasRef.current)
			this.canvasRef.current.style.cursor = "crosshair"

		this.cursor = "default"
	}

	public onCantPlace({ reason }: { reason: Reason }) {
		NotificationsManager.addNotification({
			...ClientNotificationMap[reason],
			type: "error",
		})

		this.pointer.startShake()
	}

	public onWillPlace(point: Point) {
		if (CooldownManager.hasCooldown.peek()) {
			return this.emit("cant-place", { reason: "Cooldown" })
		}

		if (ProfileManager.profile.peek() === null) {
			return this.emit("cant-place", { reason: "Not logged" })
		}

		if (InfoManager.info.value === null || PlaceManager.image.value === null) {
			return
		}
		if (InfoManager.info.value.ended) {
			return this.emit("cant-place", { reason: "Game ended" })
		}

		if (ProfileManager.isBanned.value) {
			return this.emit("cant-place", { reason: "Banned" })
		}

		const color = PlaceManager.image.value.getPixel(point)

		this.place.setSquare(point, PaletteManager.palette.value.selected)

		AppFetch.putPixel({
			color: PaletteManager.palette.value.selected.toHex(),
			x: point.x,
			y: point.y,
		}).catch((r) => {
			this.place.setSquare(point, color)
		})
	}

	public onPlace(point: Point) {
		this.pointer.hover(point)
		// if (ProfileManager.isMod.value) {
		//     return
		// };
		CooldownManager.start()
	}

	public onHover(point: Point) {
		CoordinatesManager.setCoordinates(point)
		this.pointer.hover(point)

		if (SnapshotManager.drag.value) SnapshotManager.dragMove(point)

		if (this.pixelInfo.lastPoint.equals(point)) return
		if (this.pixelInfo.timeoutId !== -1) {
			window.clearTimeout(this.pixelInfo.timeoutId)
			this.pixelInfo.timeoutId = -1
		}

		CoordinatesManager.info.value = "loading"
		this.pixelInfo.lastPoint = point.clone()
		this.pixelInfo.timeoutId = window.setTimeout(() => {
			if (
				CoordinatesManager.coordinates.value.x === -1 ||
				CoordinatesManager.coordinates.value.y === -1
			) {
				return
			}
			CoordinatesManager.fetchInfo()
		}, config.time.pixelInfo)
	}

	public update() {
		this.place.texture.update()
	}

	public onOut() {
		CoordinatesManager.removeCoordinates()
		this.pointer.out()
	}

	public onWillColorPick(color: AppColor) {
		ColorPickerManager.isEnabled.value = false

		this.pointer.background.tint = color
		this.pointer.border.tint = color.getReadableColor()

		PaletteManager.addAndSelect(color)
	}
}
