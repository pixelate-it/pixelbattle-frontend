import { ComponentChildren } from "preact";
import styles from "./WindowBox.module.css";
import { useEffect, useRef, useState } from "preact/hooks";

interface WindowProps {
	children: ComponentChildren;
	title: string;
	showTip?: boolean;
}

export function WindowBox({ children, title }: WindowProps) {
	const [opened, setOpened] = useState<boolean>(false);
	const [show, setShow] = useState<boolean>(false);

	const click = () => {
		setOpened(!opened);
	};

	useEffect(() => {
		setTimeout(() => {
			setShow(true);
		}, 1000);
	}, []);

	return (
		<div className={`${styles.window} ${opened ? styles.opened : styles.closed}`}>
			<label htmlFor={styles.window} className={styles.title} onClick={click}>
				{title}
			</label>
			<div className={styles.content}>{show && <div className={styles.container}>{children}</div>}</div>
		</div>
	);
}
