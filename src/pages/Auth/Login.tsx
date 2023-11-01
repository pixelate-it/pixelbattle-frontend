import { useRoute } from "preact-iso"
import { useEffect } from "preact/hooks"
import { config } from "../../config";

export function Login() {
    const redirectUrl = new URLSearchParams({
        client_id: config.discord.clientId,
        redirect_uri: config.discord.redirectUri,
        response_type: "code",
        scope: config.discord.scope.join(" "),
    })

    useEffect(() => {  
        window.location.replace(`https://discord.com/api/oauth2/authorize?${redirectUrl}`)
    })

    return null;
}