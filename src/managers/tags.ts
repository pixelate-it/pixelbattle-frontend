import { signal } from "@preact/signals"
import { FormatedTag } from "../interfaces/Tag"
import { createContext } from "preact"
import { AppFetch } from "../types/AppFetch"
import { ProfileManager } from "./profile"

export const TagsManager = {
    tags: signal([] as FormatedTag[]),
    selectedTag: signal(""),
    async fetch() {
        const response = await AppFetch.tags()

        TagsManager.tags.value = response.tags.map((tag, index) => ({
            name: tag[0],
            pixels: tag[1],
            place: index
        }))

        if (!ProfileManager.isAuthenticated.value) {
            return
        }
        

        const hasUserSelectedTag = ProfileManager.user.value.tag !== null
        if (!hasUserSelectedTag) {
            return
        }

        TagsManager.selectedTag.value = ProfileManager.user.value.tag ?? ""


        const isUserSelectedTagFake = !TagsManager.tags.value.some(tag => tag.name === TagsManager.selectedTag.value)
        if (isUserSelectedTagFake) {
            TagsManager.pushFakeTag(ProfileManager.user.value.tag ?? "???")
        }



    },
    pushFakeTag(name: string) {
        TagsManager.tags.value = [
            ...TagsManager.tags.value,
            {
                name,
                pixels: -1,
                place: TagsManager.tags.value.length
            }
        ]
    },
    purgeFakeTags() {
        TagsManager.tags.value = TagsManager.tags.value.filter(tag => tag.pixels !== -1)
    },
    select(name: string) {
        const previousTag = TagsManager.selectedTag.value

        if (previousTag === name) {
            return
        }

        const isPreviousTagFake = TagsManager.tags.value.find(tag => tag.name === previousTag)?.pixels === -1
        if (isPreviousTagFake) {
            TagsManager.purgeFakeTags()
        }

        const isCurrentTagReal = TagsManager.tags.value.find(tag => tag.name === name);
        if (!isCurrentTagReal) {
            TagsManager.pushFakeTag(name)
        }

        TagsManager.selectedTag.value = name

        AppFetch.changeTag(name).then(() => ProfileManager.fetch())
    },
    remove() {
        TagsManager.selectedTag.value = ""
        TagsManager.purgeFakeTags()
        AppFetch.changeTag("").then(() => ProfileManager.fetch())
    }
}

export const TagsContext = createContext({} as typeof TagsManager)