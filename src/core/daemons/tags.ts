import createStore, { Listener } from 'unistore'
import { TagsState } from './types'
import { ProfileDaemon } from './profile'
import RequestsDaemon from './requests'

const initialState = {
  tags: [],
  loaded: false,
  selectedTag: '',
  isTagCreateOpened: false
}

export class TagsDaemon {
  private static store = createStore<TagsState>(initialState)

  static async fetch() {
    const response = await RequestsDaemon.tags()

    const tags = response.tags.map((tag, index) => ({
      name: tag[0],
      pixels: tag[1],
      place: index
    }))

    TagsDaemon.setState({
      tags,
      loaded: true
    })

    const profile = ProfileDaemon.state

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
    const selectedTag = profile.user.tag ?? ''

    TagsDaemon.setState({ selectedTag })

    const isUserSelectedTagFake = !tags.some((tag) => tag.name === selectedTag)
    if (isUserSelectedTagFake) {
      TagsDaemon.pushFakeTag(profile.user.tag ?? '???')
    }
  }

  private static pushFakeTag(name: string) {
    const tags = TagsDaemon.state
    TagsDaemon.setState({
      tags: [
        ...tags.tags,
        {
          name,
          pixels: -1,
          place: tags.tags.length
        }
      ]
    })
  }

  static purgeFakeTags() {
    TagsDaemon.setState({
      tags: TagsDaemon.state.tags.filter((tag) => tag.pixels !== -1)
    })
  }

  static select(name: string) {
    const tags = TagsDaemon.state

    if (tags.selectedTag === name) {
      return
    }

    const isPreviousTagFake =
      tags.tags.find((tag) => tag.name === tags.selectedTag)?.pixels === -1
    if (isPreviousTagFake) {
      TagsDaemon.purgeFakeTags()
    }

    const isCurrentTagReal = tags.tags.find((tag) => tag.name === name)
    if (!isCurrentTagReal) {
      TagsDaemon.pushFakeTag(name)
    }

    TagsDaemon.setState({ selectedTag: name })
  }

  static selectAndFetch(name: string) {
    TagsDaemon.select(name)

    RequestsDaemon.changeTag(name).then(() => ProfileDaemon.fetch())
  }

  static remove() {
    TagsDaemon.setState({ selectedTag: '' })
    TagsDaemon.purgeFakeTags()
    RequestsDaemon.changeTag('').then(() => ProfileDaemon.fetch())
  }

  static changeTagCreateOpened(isTagCreateOpened: boolean) {
    TagsDaemon.setState({ isTagCreateOpened })
  }

  private static setState(state: Partial<TagsState>) {
    TagsDaemon.store.setState(state as Pick<TagsState, keyof TagsState>)
  }

  static get state(): TagsState {
    return TagsDaemon.store.getState()
  }

  static on(f: Listener<TagsState>) {
    TagsDaemon.store.subscribe(f)
  }

  static off(f: Listener<TagsState>) {
    TagsDaemon.store.unsubscribe(f)
  }
}
