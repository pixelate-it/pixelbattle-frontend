import { createContext } from "preact";
import { Signal, computed, signal } from "@preact/signals";
import { ProfileInfo, UserRole } from "../interfaces/Profile";
import { AppFetch } from "../classes/AppFetch";
import { AppCookie } from "../classes/AppCookie";

export const ProfileManager = {
    user: signal(null) as Signal<null | ProfileInfo>,
    profile: signal(null) as Signal<null | { token: string, id: string }>,
    isAuthenticated: computed(() => false),
    isBanned: computed(() => false),
    isStaff: computed(() => false),
    load() {
        const token = AppCookie.get("token")
        const id = AppCookie.get("userid")

        if (token && id)
            ProfileManager.profile.value = { token, id }
    },
    async fetch() {
        const profile = await AppFetch.profile()

        ProfileManager.user.value = profile
    },
    login(token: string, id: string) {
        ProfileManager.profile.value = { token, id }
    },
    logout() {
        ProfileManager.profile.value = null;
        ProfileManager.user.value = null

        AppCookie.clear()
    },
}

ProfileManager.isAuthenticated = computed(() => !!ProfileManager.profile.value)
ProfileManager.isBanned = computed(() => !!ProfileManager.user.value?.banned)
ProfileManager.isStaff = computed(() => (ProfileManager.user.value?.role ?? UserRole.User) >= UserRole.Moderator)

export const ProfileContext = createContext({} as typeof ProfileManager)



