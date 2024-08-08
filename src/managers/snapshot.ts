import { signal } from "@preact/signals";
import { createContext } from "preact";
import { Point } from "@pixi/math";
import { PlaceManager } from "./place";
import { NotificationsManager } from "./notifications";
import { ClientNotificationMap } from "../lib/notificationMap";
import { ImageFormat } from "../classes/AppImage";

function convertRGBtoRGBA(DATA_RGB: Uint8ClampedArray, { x, y }: Point) {
	const DATA_RGBA = new Uint8ClampedArray(x * y * ImageFormat.RGBA);
	for (let i = 0, j = 0; i < DATA_RGB.length; i += 3, j += 4) {
		DATA_RGBA[j] = DATA_RGB[i];
		DATA_RGBA[j + 1] = DATA_RGB[i + 1];
		DATA_RGBA[j + 2] = DATA_RGB[i + 2];
		DATA_RGBA[j + 3] = 255;
	}
	return DATA_RGBA;
}

export const SnapshotManager = {
	enable: signal(false),
	isEmpty: signal(true),
	captureMode: signal(false),

	pos: signal(new Point()),
	size: signal(new Point()),
	scale: signal(4),

	stopCapture() {
		this.toggleCapture();
		this.enable.value = false;
	},

	toggleCapture() {
		this.enable.value = !this.enable.value;
		this.pos.value = new Point();
		this.size.value = new Point();
		this.captureMode.value = false;
		this.isEmpty.value = true;
	},

	toggleCaptureMode(point: Point): boolean {
		if (this.captureMode.value) {
			this.enable.value = false;
			this.captureMode.value = false;
			this.isEmpty.value = false;
			this.toClipboard();
			return false;
		}
		this.captureMode.value = !this.captureMode.value;
		this.pos.value = point;
		this.size.value = new Point(0, 0);
		this.isEmpty.value = true;
		return true;
	},

	onPointerMove(pos: Point) {
		const normalSize = new Point(-this.pos.value.x + pos.x, -this.pos.value.y + pos.y);
		normalSize.x = normalSize.x - (normalSize.x < 0 ? 0 : -1);
		normalSize.y = normalSize.y - (normalSize.y < 0 ? 0 : -1);
		this.size.value = normalSize;
	},

	fullScreenshot() {
		const image = PlaceManager.image.value;
		if (!image) return;
		image.size;
		this.pos.value = new Point();
		this.size.value = new Point(image.size.x, image.size.y);
		this.isEmpty.value = false;
		this.toClipboard(2);
	},

	async toClipboard(scaleLimit: number = 10) {
		const image = PlaceManager.image.value;
		if (!image) return;
		const pos = this.pos.value;
		const size = this.size.value;
		let scale = this.scale.value;
		if (scale > scaleLimit) scale = scaleLimit;
		if (scale < 1) scale = 1;

		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d")!;

		const bitmap = await createImageBitmap(new ImageData(convertRGBtoRGBA(image.buffer, image.size), image.size.x));

		canvas.width = size.x * scale;
		canvas.height = size.y * scale;

		ctx.imageSmoothingEnabled = false;
		ctx.drawImage(bitmap, pos.x, pos.y, size.x, size.y, 0, 0, size.x * scale, size.y * scale);

		canvas.toBlob(async (blob) => {
			try {
				// @ts-ignore
				const clbEl = new ClipboardItem({ "image/png": blob });
				await navigator.clipboard.write([clbEl]);
				NotificationsManager.addNotification({
					...ClientNotificationMap.SnapshotSuccess,
					type: "success",
				});
			} catch {
				NotificationsManager.addNotification({
					...ClientNotificationMap.SnapshotFailed,
					type: "error",
				});
			}
		});
	},

	async toFile() {
		const image = PlaceManager.image.value;
		if (!image) return;

		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d")!;

		const pos = this.pos.value;
		const size = this.size.value;
		let scale = this.scale.value;
		if (scale < 1) scale = 1;

		const bitmap = await createImageBitmap(new ImageData(convertRGBtoRGBA(image.buffer, image.size), image.size.x));

		canvas.width = size.x * scale;
		canvas.height = size.y * scale;

		ctx.imageSmoothingEnabled = false;
		ctx.drawImage(bitmap, pos.x, pos.y, size.x, size.y, 0, 0, size.x * scale, size.y * scale);

		const dataURL = canvas.toDataURL("image/png");
		const link = document.createElement("a");
		link.href = dataURL;
		link.download = `result.png`;
		link.click();
	},
};

export const SnapshotContext = createContext({} as typeof SnapshotManager);
