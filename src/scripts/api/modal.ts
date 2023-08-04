interface ModalInfo {
    title: string;
    type: "error" | "info";
    description: string;
}

export class Modal {
    constructor(public info: ModalInfo) {}

    public render() {
        const dialog = document.getElementById("modal") as HTMLDialogElement;

        // dialog.className = `modal ${this.info.type}`
        dialog.innerHTML = `
            <h3 class="title">${this.info.title}</h3>
            <p class="description">${this.info.description}</p>

            <form method="dialog" class="close">
                <button></button>
            </form>
        `

        dialog.showModal();
    }
}