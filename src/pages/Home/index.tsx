import { Place } from '../../components/Place/Place';
import { PlaceContext, PlaceSignal } from '../../context/place';
import { PaletteContext, PaletteSignal } from '../../context/palette';
import { PaletteGroup } from '../../components/Palette/PaletteGroup/PaletteGroup';
import { InfoContext, InfoSignal } from '../../context/info';
import { Palette } from '../../components/Palette/Palette/Palette';
import { Sidebar } from '../../components/Sidebar/Sidebar';

export function Home() {
    return (
        <InfoContext.Provider value={InfoSignal}>
            <PlaceContext.Provider value={PlaceSignal}>
                <PaletteContext.Provider value={PaletteSignal}>
                    <Place />
                    <Palette />
                    <Sidebar />
                </PaletteContext.Provider>
            </PlaceContext.Provider>
        </InfoContext.Provider>

    );
}
