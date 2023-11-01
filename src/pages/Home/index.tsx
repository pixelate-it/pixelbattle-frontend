import { Place } from '../../components/Place/Place';
import { PlaceContext, PlaceManager } from '../../managers/place';
import { PaletteContext, PaletteManager } from '../../managers/palette';
import { PaletteGroup } from '../../components/Palette/PaletteGroup/PaletteGroup';
import { InfoContext, InfoManager } from '../../managers/info';
import { Palette } from '../../components/Palette/Palette/Palette';
import { Sidebar } from '../../components/Sidebar/Sidebar';
import { ProfileContext, ProfileManager } from '../../managers/profile';
import { TitleBar } from '../../components/TitleBar/TitleBar';
import { Cooldown } from '../../components/Cooldown/Cooldown';
import { CooldownContext, CooldownManager } from '../../managers/cooldown';
import { BottomBar } from '../../components/BottomBar/BottomBar';
import { CoordinatesContext, CoordinatesManager } from '../../managers/coordinates';
import { TagsContext, TagsManager } from '../../managers/tags';
import { ColorPickerContext, ColorPickerManager } from '../../managers/picker';
import { TopBar } from '../../components/TopBar/TopBar';
import { NotificationsContext, NotificationsManager } from '../../managers/notifications';

export function Home() {
    return (
        <NotificationsContext.Provider value={NotificationsManager}>
            <ProfileContext.Provider value={ProfileManager}>
                <TagsContext.Provider value={TagsManager}>
                    <InfoContext.Provider value={InfoManager}>
                        <ColorPickerContext.Provider value={ColorPickerManager}>
                            <CooldownContext.Provider value={CooldownManager}>
                                <CoordinatesContext.Provider value={CoordinatesManager}>
                                    <PlaceContext.Provider value={PlaceManager}>
                                        <PaletteContext.Provider value={PaletteManager}>
                                            <Place />
                                            <TopBar />
                                            <BottomBar />
                                        </PaletteContext.Provider>
                                    </PlaceContext.Provider>
                                </CoordinatesContext.Provider>
                            </CooldownContext.Provider>
                        </ColorPickerContext.Provider>
                    </InfoContext.Provider>
                </TagsContext.Provider>
            </ProfileContext.Provider>
        </NotificationsContext.Provider>
    );
}
