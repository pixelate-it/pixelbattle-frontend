import { app } from "../app"

interface ProfileInfo {
    // "token": "",
	userID: string,
	cooldown: number,
	tag?: string,
	banned: boolean,
	username: string
}

export class ProfileController {
    public info: ProfileInfo
    public container = document.getElementById("profile")

    constructor() {
        this.setup()
    }

    public setup() {
        if (!app.auth.token) return this.renderLogin()

        this.fetchInfo().then(() => this.renderProfile())
    }

    public async fetchInfo() {
        this.info = await app.request.post<ProfileInfo>("/user/getInfo")()
    }

    public async setTag(tag: string) {
        this.info.tag = tag
        app.request.post("/user/changeTag")({ tag })
            .catch((e) => e.reason)
            .then(() => this.fetchInfo())
    }

    public renderProfile() {
        this.container.innerHTML = `
        <details class="user">
            <summary class="title">Профиль</summary>
            <div class="content">
                <div class="param">
                    <div class="name">Никнейм</div>
                    <div class="value">${this.info.username}</div>
                </div>
                <div class="param">
                    <div class="name">Айди</div>
                    <div class="value">${this.info.userID}</div>
                </div>
                <div class="param">
                    <div class="name">Текущий тег</div>
                    <form class="value new">
                        <input type="text" value="${this.info.tag ?? ""}" placeholder="Не указан" name="tag" minlength="4" maxlength="8">
                        <button class="button">Изменить</button>
                    </form>
                </div>
            </div>
        </details>
        `

        const logoutButton = document.createElement("button")
        logoutButton.classList.add("button")
        logoutButton.innerHTML = "Выйти"
        logoutButton.addEventListener("click", (e) => {
            e.preventDefault()

            app.auth.logout()
        })

        const form = this.container.querySelector("form")!
        const newTag = this.container.querySelector(".new input") as HTMLInputElement

        form.addEventListener("submit", (e) => {
            e.preventDefault()

            this.setTag(newTag.value)
        })

        this.container.querySelector(".content")!.appendChild(logoutButton)
    }

    public renderLogin() {
        const loginButton = document.createElement("button")

        loginButton.classList.add("button")
        loginButton.innerHTML = "Войти"
        loginButton.addEventListener("click", (e) => {
            e.preventDefault()

            app.auth.redirectToDiscord()
        })

        this.container.appendChild(loginButton)
    }
}