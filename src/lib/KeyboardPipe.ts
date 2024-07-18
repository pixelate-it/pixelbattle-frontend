export class KeyboardPipe {
	private pipeOfKeys: Array<string> = [];
	private pipeOfListeners: Array<KeyboardListener> = [];
	private storedKeyCodes: Record<string, true> = {};

	public sub(keyCode: string, listener: KeyboardListenerToSub) {
		this.storedKeyCodes[keyCode] = true;
		this.pipeOfKeys.push(keyCode);
		this.pipeOfListeners.push(listener);
	}

	public emit({ repeat, code, type, ctrlKey }: KeyboardEvent) {
		if (this.storedKeyCodes[code] && !repeat) {
			this.pipeOfKeys.forEach((v, i, vo) => {
				if (code === v)
					this.pipeOfListeners[i]({
						isKeyDown: type === "keydown",
						ctrlKey,
					});
			});
		}
	}
}

export type KeyboardListenerToSub = () => void | KeyboardListener;

export type KeyboardListener = (props: KeyboardListenerProps) => void;

export interface KeyboardListenerProps {
	isKeyDown: boolean;
	ctrlKey: boolean;
}
