import { useContext, useEffect } from "preact/hooks"
import { ProfileContext, ProfileManager } from "../../managers/profile"

export function Logout() {
    useEffect(() => {
        ProfileManager.deleteToken()
        
        window.location.replace("/")
    }, [])


    return null
}