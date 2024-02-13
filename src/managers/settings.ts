import { createContext } from "preact";
import { ReadonlySignal, Signal, computed, signal } from "@preact/signals";
import { config } from "../config";
import { ProfileInfo } from "../interfaces/Profile";
import { AppFetch } from "../classes/AppFetch";
import { Settings } from "../interfaces/Settings";
import { AppLocalStorage } from "../classes/AppLocalStorage";


export const SettingsManager = {
    settings: signal(config.defaults.settings),
    load() {
        const settings = AppLocalStorage.get("settings")
        if (settings) 
            this.settings.value = settings;
    },
    save() {
        AppLocalStorage.set("settings", this.settings.value ?? config.defaults.settings) 
    },
}
  
export const SettingsContext = createContext({} as typeof SettingsManager)



