import { AppRequests } from 'src/classes/AppRequests'
import { TagsState } from 'src/types/managers/tags'
import createStore from 'unistore'
import { ComputedProfileStore, ProfileManager, ProfileStore } from './profile'

export const TagsStore = createStore<TagsState>({
  tags: [],
  selectedTag: '',
  isTagCreateOpened: false
})

export const TagsManager = {
  async fetch() {
    const response = await AppRequests.tags()

    TagsStore.setState({
      tags: response.tags.map((tag, index) => ({
        name: tag[0],
        pixels: tag[1],
        place: index
      }))
    })

    const profile = {
      ...ComputedProfileStore.getState(),
      ...ProfileStore.getState()
    }

    if (!profile.isAuthenticated) {
      return
    }

    if (profile.user === null) {
      return
    }

    const hasUserSelectedTag = profile.user.tag !== null
    if (!hasUserSelectedTag) {
      return
    }

    const tags = TagsStore.getState()

    TagsStore.setState({ selectedTag: profile.user.tag ?? '' })

    const isUserSelectedTagFake = !tags.tags.some(
      (tag) => tag.name === tags.selectedTag
    )
    if (isUserSelectedTagFake) {
      TagsManager.pushFakeTag(profile.user.tag ?? '???')
    }
  },
  pushFakeTag(name: string) {
    const tags = TagsStore.getState()
    TagsStore.setState({
      tags: [
        ...tags.tags,
        {
          name,
          pixels: -1,
          place: tags.tags.length
        }
      ]
    })
  },
  purgeFakeTags() {
    TagsStore.setState({
      tags: TagsStore.getState().tags.filter((tag) => tag.pixels !== -1)
    })
  },
  select(name: string) {
    const tags = TagsStore.getState()

    if (tags.selectedTag === name) {
      return
    }

    const isPreviousTagFake =
      tags.tags.find((tag) => tag.name === tags.selectedTag)?.pixels === -1
    if (isPreviousTagFake) {
      TagsManager.purgeFakeTags()
    }

    const isCurrentTagReal = tags.tags.find((tag) => tag.name === name)
    if (!isCurrentTagReal) {
      TagsManager.pushFakeTag(name)
    }

    TagsStore.setState({ selectedTag: name })
  },
  selectAndFetch(name: string) {
    this.select(name)

    AppRequests.changeTag(name).then(() => ProfileManager.fetch())
  },
  remove() {
    TagsStore.setState({ selectedTag: '' })
    TagsManager.purgeFakeTags()
    AppRequests.changeTag('').then(() => ProfileManager.fetch())
  }
}
