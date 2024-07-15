import { signal } from "@preact/signals"
import { createContext } from "preact"
import { Point } from "@pixi/math"
import { PlaceManager } from "./place"
import { NotificationsManager } from "./notifications"
import { ClientNotificationMap } from "../lib/notificationMap"

export const SnapshotManager = {
	active: signal(false),
	drag: signal(false),
	pos: signal(new Point()),
	size: signal(new Point()),
	isEmpty: signal(true),

	stopCapture() {
		SnapshotManager.active.value = false
		SnapshotManager.isEmpty.value = true
		SnapshotManager.drag.value = false
		SnapshotManager.pos.value = new Point(0, 0)
		SnapshotManager.size.value = new Point(0, 0)
	},

	toggleCapture() {
		SnapshotManager.active.value = !SnapshotManager.active.value
		SnapshotManager.size.value = new Point(0, 0)
		SnapshotManager.drag.value = false
		SnapshotManager.isEmpty.value = true
	},

	toggleDrag(point: Point): boolean {
		if (SnapshotManager.drag.value) {
			SnapshotManager.active.value = false
			SnapshotManager.drag.value = false
			SnapshotManager.isEmpty.value = false
			SnapshotManager.toClipboard()
			return false
		}
		SnapshotManager.drag.value = !SnapshotManager.drag.value
		SnapshotManager.pos.value = point
		SnapshotManager.size.value = new Point(0, 0)
		SnapshotManager.isEmpty.value = true
		return true
	},

	dragMove(size: Point) {
		const normalSize = new Point(
			-SnapshotManager.pos.value.x + size.x,
			-SnapshotManager.pos.value.y + size.y
		)
		normalSize.x = normalSize.x - (normalSize.x < 0 ? 0 : -1)
		normalSize.y = normalSize.y - (normalSize.y < 0 ? 0 : -1)
		SnapshotManager.size.value = normalSize
	},

	fullScreenshot() {
		const image = PlaceManager.image.value
		if (!image) return
		SnapshotManager.pos.value = new Point()
		SnapshotManager.size.value = new Point(image.size.x, image.size.y)
		SnapshotManager.isEmpty.value = false
		SnapshotManager.toClipboard()
	},

	async toClipboard() {
		const image = PlaceManager.image.value
		if (!image) return
		const pos = SnapshotManager.pos.value
		const size = SnapshotManager.size.value

		const bitmap = await createImageBitmap(image.raw)

		const canvas = document.createElement("canvas")
		const ctx = canvas.getContext("2d")!

		canvas.width = size.x
		canvas.height = size.y

		console.log(pos, size)

		ctx.drawImage(bitmap, pos.x, pos.y, size.x, size.y, 0, 0, size.x, size.y)

		canvas.toBlob(async (blob) => {
			try {
				// @ts-ignore
				const clbEl = new ClipboardItem({ "image/png": blob })
				await navigator.clipboard.write([clbEl])
				NotificationsManager.addNotification({
					...ClientNotificationMap.SnapshotSuccess,
					type: "success",
				})
			} catch {
				NotificationsManager.addNotification({
					...ClientNotificationMap.SnapshotFailed,
					type: "error",
				})
			}
		})
	},

	async toFile() {
		const image = PlaceManager.image.value
		if (!image) return

		const bitmap = await createImageBitmap(image.raw)
		const canvas = document.createElement("canvas")
		const ctx = canvas.getContext("2d")!

		const pos = SnapshotManager.pos.value
		const size = SnapshotManager.size.value

		canvas.width = size.x
		canvas.height = size.y

		ctx.drawImage(bitmap, pos.x, pos.y, size.x, size.y, 0, 0, size.x, size.y)

		const dataURL = canvas.toDataURL("image/png")
		const link = document.createElement("a")
		link.href = dataURL
		link.download = `result.png`
		link.click()
	},
}

export const SnapshotContext = createContext({} as typeof SnapshotManager)
