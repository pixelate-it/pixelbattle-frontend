import { app } from "../app";
import { config } from "../config";

interface Tag {
    name: string;
    uses: number;
}
type StupidTag = [string, number];

export class TagsController {
    public tags: Tag[] = [];

    constructor() {
        this.update()
        this.startUpdating();
    }

    public update() {
        this.fetchTags().then(() => this.render());
    }

    public startUpdating() {
        setInterval(this.update.bind(this), config.updateTime.tags);
    }



    public async fetchTags() {
        const { tags: stupidTags } = await app.request.get<{ tags: StupidTag[] }>("/pixels/get/tag")

        const tags = stupidTags.map(tag => {
            return {
                name: tag[0],
                uses: tag[1]
            }
        })

        this.tags = tags
    }

    public render() {
        const tagContainer = document.getElementById("tags");

        tagContainer.innerHTML = "";
        if (!this.tags.length) 
            return tagContainer.innerHTML = `<p class="empty">Нет тегов</p>`;

        this.tags.forEach((tag, index) => {
            const tagElement = document.createElement('div');
            tagElement.classList.add('tag');
            tagElement.innerHTML = `
                <div class="place">${index + 1}</div>
                <div class="name">${tag.name}</div>
                <div class="uses">${tag.uses}</div>
            `;

            tagContainer.appendChild(tagElement);
        })
    }
}