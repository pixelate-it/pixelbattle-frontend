import { signal } from "@preact/signals";
import { KeyboardPipe } from "../lib/KeyboardPipe";

export const KeyboardManager = {
	pipe: signal(new KeyboardPipe()),

	_listener(event: KeyboardEvent) {
		KeyboardManager.pipe.value.emit(event);
	},

	addEventListeners() {
		document.addEventListener("keydown", KeyboardManager._listener);
		document.addEventListener("keyup", KeyboardManager._listener);
	},

	removeEventListeners() {
		document.removeEventListener("keydown", KeyboardManager._listener);
		document.removeEventListener("keyup", KeyboardManager._listener);
	},
};
