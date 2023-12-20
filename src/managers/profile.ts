import { createContext } from "preact";
import { ReadonlySignal, Signal, computed, signal } from "@preact/signals";
import { config } from "../config";
import { ProfileInfo } from "../interfaces/Profile";
import { AppFetch } from "../classes/AppFetch";
import { AppLocalStorage } from "../classes/AppLocalStorage";

export const ProfileManager = {
    user: signal(null) as Signal<null | ProfileInfo>,
    token: signal(""),
    id: signal(""),
    isAuthenticated: computed(() => false),
    isBanned: computed(() => false),
    isMod: computed(() => false),
    load() {
        ProfileManager.token.value = AppLocalStorage.profile.token ?? ""
        ProfileManager.id.value = AppLocalStorage.profile.id ?? ""
    },
    save() {
        AppLocalStorage.profile = { 
            token: ProfileManager.token.value,
            id: ProfileManager.id.value
        }
    },
    async fetch() {
        const profile = await AppFetch.profile()
        ProfileManager.user.value = profile
    },
    login(token: string, id: string) {
        ProfileManager.token.value = token
        ProfileManager.id.value = id
    },
    logout() {
        ProfileManager.token.value = ""
        ProfileManager.id.value = ""
        ProfileManager.user.value = {} as ProfileInfo
        
        AppLocalStorage.resetProfile()
    },
}

ProfileManager.isAuthenticated = computed(() => !!ProfileManager.token.value)
ProfileManager.isBanned = computed(() => !!ProfileManager.user.value?.banned)
ProfileManager.isMod = computed(() => !!ProfileManager.user.value?.isMod)

export const ProfileContext = createContext({} as typeof ProfileManager)



