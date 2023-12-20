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
        if (AppLocalStorage.settings) 
            this.settings.value = AppLocalStorage.settings;
    },
    save() {
        AppLocalStorage.settings = this.settings.value ?? config.defaults.settings
    },
}
  
export const SettingsContext = createContext({} as typeof SettingsManager)



