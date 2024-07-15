import { SnapshotManager } from "../../managers/snapshot"
import { Button } from "../General/Button/Button"
import styles from "./Snapshot.module.css"

export function SnapshotContainer() {
	return (
		<div className={styles.wrapper}>
			<Button onClick={() => void SnapshotManager.toggleCapture()}>
				{!SnapshotManager.active.value ? "Область" : "Остановить"}
			</Button>
			<p class={styles.or}>или</p>
			<Button onClick={() => void SnapshotManager.fullScreenshot()}>
				Всего холста
			</Button>

			{SnapshotManager.isEmpty.value ? (
				<></>
			) : (
				<>
					<p class={styles.groupTitle + styles.label}>Действия</p>
					<Button onClick={() => void SnapshotManager.toFile()}>
						Сохранить
					</Button>
				</>
			)}
		</div>
	)
}
