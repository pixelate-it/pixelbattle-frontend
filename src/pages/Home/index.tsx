import { PlaceContext, PlaceManager } from '../../managers/place';
import { PaletteContext, PaletteManager } from '../../managers/palette';
import { InfoContext, InfoManager } from '../../managers/info';
import { ProfileContext, ProfileManager } from '../../managers/profile';
import { CooldownContext, CooldownManager } from '../../managers/cooldown';
import { CoordinatesContext, CoordinatesManager } from '../../managers/coordinates';
import { TagsContext, TagsManager } from '../../managers/tags';
import { ColorPickerContext, ColorPickerManager } from '../../managers/picker';
import { NotificationsContext, NotificationsManager } from '../../managers/notifications';
import { SettingsContext, SettingsManager } from '../../managers/settings';

import { lazy } from 'preact/compat';
import { OverlayContext, OverlayManager } from '../../managers/overlay';
import { ModalContext, ModalManager } from '../../managers/modal';
import { Modal } from '../../components/Modal/Modal';

const Snow = lazy(() => import("../../components/Snow/Snow").then(r => r.Snow))
const Place = lazy(() => import("../../components/Place/Place").then(r => r.Place))
// const BottomBar = lazy(() => import("../../components/Bar/BottomBar/BottomBar").then(r => r.BottomBar))
const TopBar = lazy(() => import("../../components/Bar/TopBar/TopBar").then(r => r.TopBar))

export function Home() {
    // Should probably refactor this somehow
    return (
        <ModalContext.Provider value={ModalManager}>
            <NotificationsContext.Provider value={NotificationsManager}>
                <ProfileContext.Provider value={ProfileManager}>
                    <SettingsContext.Provider value={SettingsManager}>
                        <Snow />
                        <TagsContext.Provider value={TagsManager}>
                            <InfoContext.Provider value={InfoManager}>
                                <ColorPickerContext.Provider value={ColorPickerManager}>
                                    <CooldownContext.Provider value={CooldownManager}>
                                        <CoordinatesContext.Provider value={CoordinatesManager}>
                                            <PlaceContext.Provider value={PlaceManager}>
                                                <PaletteContext.Provider value={PaletteManager}>
                                                    <OverlayContext.Provider value={OverlayManager}>
                                                        <Place />
                                                        <TopBar />
                                                        <Modal />
                                                    </OverlayContext.Provider>
                                                </PaletteContext.Provider>
                                            </PlaceContext.Provider>
                                        </CoordinatesContext.Provider>
                                    </CooldownContext.Provider>
                                </ColorPickerContext.Provider>
                            </InfoContext.Provider>
                        </TagsContext.Provider>
                    </SettingsContext.Provider>
                </ProfileContext.Provider>
            </NotificationsContext.Provider>
        </ModalContext.Provider>
    );
}
