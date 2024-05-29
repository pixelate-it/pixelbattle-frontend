import { useEffect } from "preact/hooks"
import { config } from "../../config";

export function Login() {
    useEffect(() => {  
        window.location.replace(config.url.api + '/login/discord');
    })

    return null;
}