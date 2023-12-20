import { config } from "../config"
import { Settings } from "../interfaces/Settings"
import { FlatPalette, PaletteManager } from "../managers/palette"
import { AppColor } from "./AppColor"

type Palette = typeof config.defaults.colors.palette
type Profile = { 
    token: string, 
    id: string 
}




export class AppLocalStorage {
    public static set palette(palette: Palette) {
        const flatPalette: FlatPalette = {
            colors: palette.colors.map(c => c.toHexa()),
            selected: palette.selected.toHexa()
        }

        localStorage.setItem("palette", JSON.stringify(flatPalette))
    }

    public static get palette(): Palette | undefined {
        const palette = localStorage.getItem("palette")
        if (!palette) return undefined;

        const flatPalette = JSON.parse(palette) as FlatPalette

        return {
            colors: flatPalette.colors.map(c => new AppColor(c)),
            selected: new AppColor(flatPalette.selected)
        }
    }

    public static resetPalette() {
        localStorage.removeItem("palette")
    }

    public static set profile(profile: Profile) {
        localStorage.setItem("token", profile.token)
        localStorage.setItem("id", profile.id)
    }

    public static get profile(): Partial<Profile> {
        return {
            id: localStorage.getItem("id") ?? undefined,
            token: localStorage.getItem("token")?? undefined
        }
    }

    public static resetProfile() {
        localStorage.removeItem("token")
        localStorage.removeItem("id")
    }

    public static get settings(): Settings | undefined {
        const settings = localStorage.getItem("settings")

        return settings ? JSON.parse(settings) as Settings : undefined
    }

    public static set settings(settings: Settings) {
        localStorage.setItem("settings", JSON.stringify(settings))
    }

}