import { config } from "../config";



export class AuthController {
    get token() {
        return localStorage.getItem('user-token')
    }

    set token(token: string) {
        localStorage.setItem('user-token', token)
    }

    constructor() {
        this.setup()
    }

    public setup() {
        if(this.token) return;
        const token = new URLSearchParams(document.location.search).get("token")

        if (!token) return;

        this.token = token;
        window.location.replace("/")
    }


    public redirectToDiscord() {
        const redirectUrl = new URLSearchParams({
            client_id: config.discord.clientId,
            redirect_uri: config.discord.redirectUri,
            response_type: "code",
            scope: config.discord.scope.join(" "),
        })

        document.location.href = `https://discord.com/api/oauth2/authorize?${redirectUrl}`;
    }


    public logout() {
        localStorage.removeItem("user-token");
        document.location.reload()
    }
}


