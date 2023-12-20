import { Place } from '../../components/Place/Place';
import { PlaceContext, PlaceManager } from '../../managers/place';
import { PaletteContext, PaletteManager } from '../../managers/palette';
import { PaletteGroup } from '../../components/Palette/PaletteGroup/PaletteGroup';
import { InfoContext, InfoManager } from '../../managers/info';
import { Palette } from '../../components/Palette/Palette/Palette';
import { ProfileContext, ProfileManager } from '../../managers/profile';
import { Cooldown } from '../../components/Cooldown/Cooldown';
import { CooldownContext, CooldownManager } from '../../managers/cooldown';
import { BottomBar } from '../../components/Bar/BottomBar/BottomBar';
import { CoordinatesContext, CoordinatesManager } from '../../managers/coordinates';
import { TagsContext, TagsManager } from '../../managers/tags';
import { ColorPickerContext, ColorPickerManager } from '../../managers/picker';
import { TopBar } from '../../components/Bar/TopBar/TopBar';
import { NotificationsContext, NotificationsManager } from '../../managers/notifications';
import { Snow } from '../../components/Snow/Snow';
import { SettingsContext, SettingsManager } from '../../managers/settings';

export function Home() {

    // Should probably refactor this somehow
    return (
        <NotificationsContext.Provider value={NotificationsManager}>
            <ProfileContext.Provider value={ProfileManager}>
                <SettingsContext.Provider value={SettingsManager}>
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
                                                <Snow />
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
    );
}
