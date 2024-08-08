import { PlaceContext, PlaceManager } from "../../managers/place"
import { PaletteContext, PaletteManager } from "../../managers/palette"
import { CursorContext, CursorManager } from "../../managers/cursor"
import { InfoContext, InfoManager } from "../../managers/info"
import { ProfileContext, ProfileManager } from "../../managers/profile"
import { CooldownContext, CooldownManager } from "../../managers/cooldown"
import {
	CoordinatesContext,
	CoordinatesManager,
} from "../../managers/coordinates"
import { TagsContext, TagsManager } from "../../managers/tags"
import { ColorPickerContext, ColorPickerManager } from "../../managers/picker"
import {
	NotificationsContext,
	NotificationsManager,
} from "../../managers/notifications"
import { SettingsContext, SettingsManager } from "../../managers/settings"
import { OverlayContext, OverlayManager } from "../../managers/overlay"
import { ModalContext, ModalManager } from "../../managers/modal"

import { lazy } from "preact/compat"
import { Modal } from "../../components/Modal/Modal"
import { Cursor } from "../../components/Cursor/Cursor"
import { SnapshotContext, SnapshotManager } from "../../managers/snapshot"

const Snow = lazy(() =>
	import("../../components/Snow/Snow").then((r) => r.Snow)
)
const Place = lazy(() =>
	import("../../components/Place/Place").then((r) => r.Place)
)
// const BottomBar = lazy(() => import("../../components/Bar/BottomBar/BottomBar").then(r => r.BottomBar))
const TopBar = lazy(() =>
	import("../../components/Bar/TopBar/TopBar").then((r) => r.TopBar)
)

export function Home() {
	// Should probably refactor this somehow
	return (
		<>
			<SettingsContext.Provider value={SettingsManager}>
				<Snow />
			</SettingsContext.Provider>
			<InfoContext.Provider value={InfoManager}>
				<ColorPickerContext.Provider value={ColorPickerManager}>
					<CursorContext.Provider value={CursorManager}>
						<Cursor />
						<PlaceContext.Provider value={PlaceManager}>
							<OverlayContext.Provider value={OverlayManager}>
								<SnapshotContext.Provider value={SnapshotManager}>
									<Place />
									<NotificationsContext.Provider value={NotificationsManager}>
										<TagsContext.Provider value={TagsManager}>
											<ModalContext.Provider value={ModalManager}>
												<Modal />
												<ProfileContext.Provider value={ProfileManager}>
													<CoordinatesContext.Provider
														value={CoordinatesManager}
													>
														<CooldownContext.Provider value={CooldownManager}>
															<PaletteContext.Provider value={PaletteManager}>
																<TopBar />
															</PaletteContext.Provider>
														</CooldownContext.Provider>
													</CoordinatesContext.Provider>
												</ProfileContext.Provider>
											</ModalContext.Provider>
										</TagsContext.Provider>
									</NotificationsContext.Provider>
								</SnapshotContext.Provider>
							</OverlayContext.Provider>
						</PlaceContext.Provider>
					</CursorContext.Provider>
				</ColorPickerContext.Provider>
			</InfoContext.Provider>
		</>
	)
}
