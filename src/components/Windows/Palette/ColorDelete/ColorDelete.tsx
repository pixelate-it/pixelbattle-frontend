import { useContext, useEffect, useRef, useState } from "preact/hooks";
import { PaletteContext } from "../../../../managers/palette";
import styles from "./ColorDelete.module.css";
import { Icon } from "../../../General/Icon/Icon";

export function ColorDelete() {
	const palette = useContext(PaletteContext);
	const [shift, setShift] = useState<boolean>(false);
	const touchTimerRef = useRef<NodeJS.Timeout>();
	const [disabled, setDisabled] = useState<boolean>(true);

	function onKeyEvent(event: KeyboardEvent) {
		setShift(event.shiftKey);
	}

	function onClickStart(event: MouseEvent | TouchEvent) {
		event.preventDefault();
		if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
		if (!palette.isDefaultColors()) {
			touchTimerRef.current = setTimeout(() => {
				palette.reset();
			}, 500);
			setDisabled(false);
		}
	}

	function onClickEnd(event: MouseEvent | TouchEvent) {
		event.preventDefault();
		if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
		if (event.shiftKey) {
			palette.reset();
			return;
		}
		if (!palette.isDefaultColor(palette.palette.value.selected)) {
			palette.removeColor(palette.palette.value.selected);
		}
		setDisabled(true);
	}

	function onClickCancel(event: MouseEvent | TouchEvent) {
		event.preventDefault();
		if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
		setDisabled(true);
	}

	useEffect(() => {
		document.addEventListener("keydown", onKeyEvent);
		document.addEventListener("keyup", onKeyEvent);

		return () => {
			document.removeEventListener("keydown", onKeyEvent);
			document.removeEventListener("keyup", onKeyEvent);
		};
	}, []);

	return (
		<button
			className={[styles.button, (!disabled || shift || !palette.isDefaultColor(palette.palette.value.selected)) ? "" : styles.buttonDisabled].join(" ")}
			onMouseDown={onClickStart}
			onMouseUp={onClickEnd}
			onTouchStart={onClickStart}
			onTouchEnd={onClickEnd}
			onTouchCancel={onClickCancel}
		>
			<Icon icon="plus" className={styles.icon} alt={"Удалить выбранный цвет"} />
		</button>
	);
}
