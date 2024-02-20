import { useEffect } from "preact/hooks";
import { ProfileManager } from "../../managers/profile";

export function Logout() {
    useEffect(() => {
        ProfileManager.logout()
        
        window.location.replace("/")
    }, [])


    return null
}