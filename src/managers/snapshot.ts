import { signal } from "@preact/signals";
import { createContext } from "preact";
import { Point } from "@pixi/math";
import { PlaceManager } from "./place";
import { ImageFormat } from "../classes/AppImage";
import { ClientNotificationMap } from "../lib/notificationMap";
import { NotificationsManager } from "./notifications";

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
	empty: signal(true),
	enable: signal(false),
	captureMode: signal(false),

	startPoint: signal(new Point()),
	offsetPoint: signal(new Point(NaN, NaN)),
	size: signal(new Point()),
	scale: signal(4),

	stop() {
		this.clear();
		this.enable.value = false;
	},

	clear() {
		this.startPoint.value = new Point();
		this.offsetPoint.value = new Point(NaN, NaN);
		this.size.value = new Point();
		this.empty.value = true;
		this.captureMode.value = false;
	},

	toggle() {
		this.enable.value = !this.enable.value;
		this.clear();
	},

	onPointerClick(startPoint: Point) {
		if (this.captureMode.value) {
			this.enable.value = false;
			this.captureMode.value = false;
			this.empty.value = false;
			this.toClipboard();
			return;
		}
		this.clear();
		this.startPoint.value = startPoint;
		this.captureMode.value = !this.captureMode.value;
	},

	onPointerMove(point: Point) {
		if (!this.enable.value || !this.captureMode) return;
		let width = -this.startPoint.value.x + point.x;
		let height = -this.startPoint.value.y + point.y;
		const offsetPoint = new Point(this.offsetPoint.value.x, this.offsetPoint.value.y);
		let changed = false;
		if (width < 0) {
			width = Math.abs(width);
			changed = true;
			offsetPoint.x = point.x;
		} else if (!Number.isNaN(offsetPoint.x)) {
			offsetPoint.x = NaN;
			changed = true;
		}
		if (height < 0) {
			height = Math.abs(height);
			changed = true;
			offsetPoint.y = point.y;
		} else if (!Number.isNaN(offsetPoint.y)) {
			offsetPoint.y = NaN;
			changed = true;
		}
		width += 1;
		height += 1;
		if (changed) this.offsetPoint.value = offsetPoint;
		const normalSize = new Point(width, height);
		this.size.value = normalSize;
	},

	fullScreenshot() {
		const image = PlaceManager.image.value;
		if (!image) return;
		this.stop();
		this.size.value = new Point(image.size.x, image.size.y);
		this.toClipboard();
		this.empty.value = false;
	},

	async toClipboard(scaleLimit = 10) {
		const image = PlaceManager.image.value;
		const startPoint = this.startPoint.value;
		const offsetPoint = this.offsetPoint.value;
		if (!image) return;
		const pos = new Point(!Number.isNaN(offsetPoint.x) ? offsetPoint.x : startPoint.x, !Number.isNaN(offsetPoint.y) ? offsetPoint.y : startPoint.y);
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

	async toFile(scaleLimit = 10) {
		const image = PlaceManager.image.value;
		const startPoint = this.startPoint.value;
		const offsetPoint = this.offsetPoint.value;
		if (!image) return;
		const pos = new Point(!Number.isNaN(offsetPoint.x) ? offsetPoint.x : startPoint.x, !Number.isNaN(offsetPoint.y) ? offsetPoint.y : startPoint.y);
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

		const dataURL = canvas.toDataURL("image/png");
		const link = document.createElement("a");
		link.href = dataURL;
		link.download = `pixelbattle_snapshot_${!Number.isNaN(offsetPoint.x) ? offsetPoint.x : startPoint.x}_${!Number.isNaN(offsetPoint.y) ? offsetPoint.y : startPoint.y}_${size.x}_${
			size.y
		}.png`;
		link.click();
	},
};

export const SnapshotContext = createContext({} as typeof SnapshotManager);
