import { createContext } from "preact";
import { ReadonlySignal, computed, signal } from "@preact/signals";
import { config } from "../config";
import { ProfileInfo } from "../interfaces/Profile";
import { MyFetch } from "../types/MyFetch";




// const example: ProfileInfo = {
//     token: "asdsvdfdgdfgdvxcv",
//     userID: "914240860101681163",
//     cooldown: 0,
//     banned: false,
//     username: "Elias",
//     tag: "",
// }

export const ProfileManager = {
    user: signal({} as ProfileInfo),
    token: signal(""),
    isAuthenticated: computed(() => false),
    load() {
        ProfileManager.token.value = localStorage.getItem("token") ?? ""
    },
    save() {
        localStorage.setItem("token", ProfileManager.token.value)
    },
    async fetchProfile() {
        ProfileManager.user.value = await MyFetch.profile(ProfileManager.token.value)
    },
    setToken(token: string) {
        ProfileManager.token.value = token
    },
    deleteToken() {
        ProfileManager.token.value = ""
        ProfileManager.user.value = {} as ProfileInfo
        localStorage.removeItem("token")
    },
}

ProfileManager.isAuthenticated = computed(() => !!ProfileManager.token.value)

  
export const ProfileContext = createContext({} as typeof ProfileManager)



