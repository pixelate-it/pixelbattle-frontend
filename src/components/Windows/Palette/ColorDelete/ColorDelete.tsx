import { useContext, useEffect, useRef, useState } from "preact/hooks";
import { PaletteContext } from "../../../../managers/palette";
import styles from "./ColorDelete.module.css";
import { Icon } from "../../../General/Icon/Icon";

export function ColorDelete() {
	const palette = useContext(PaletteContext);
	const [shift, setShift] = useState<boolean>(false);
	const touchTimerRef = useRef<NodeJS.Timeout>();

	function onClick(event: MouseEvent) {
		if (event.shiftKey) {
			palette.reset();

			return;
		}

		if (!palette.isDefaultColor(palette.palette.value.selected)) palette.removeColor(palette.palette.value.selected);
	}

	function onKeyEvent(event: KeyboardEvent) {
		setShift(event.shiftKey);
	}

	function onTouchStart(event: TouchEvent) {
		event.preventDefault();
		if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
		touchTimerRef.current = setTimeout(() => {
			palette.reset();
		}, 500);
	}

	function onTouchEnd(event: TouchEvent) {
		event.preventDefault();
		if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
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
			className={styles.button}
			onClick={onClick}
			// disabled={!(shift || !palette.isDefaultColor(palette.palette.value.selected))}
			onTouchStart={onTouchStart}
			onTouchCancel={onTouchEnd}
			onTouchEnd={onTouchEnd}
		>
			<Icon icon="plus" className={styles.icon} alt={"Удалить выбранный цвет"} />
		</button>
	);
}
