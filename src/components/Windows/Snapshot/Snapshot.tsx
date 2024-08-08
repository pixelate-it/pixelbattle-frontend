import { SnapshotContainer } from "../../Snapshot/Snapshot"
import { WindowBox } from "../../WindowBox/WindowBox"

export function Snapshot() {
	return (
		<WindowBox title="Снимок холста">
			<SnapshotContainer />
		</WindowBox>
	)
}
