import createStore, { Listener } from 'unistore'
import { ProfileState } from './types'
import { Cookie } from '../classes/storage/cookie'
import ApiRequest from '../classes/api/request'
import { UserRole } from '../classes/api/types'

const initialState = {
  isAuthenticated: false,
  isBanned: false,
  isStaff: false,
  isLoaded: false,
  profile: null,
  user: null
}

export class ProfileDaemon {
  private static store = createStore<ProfileState>(initialState)

  static load() {
    const token = Cookie.get('token')
    const id = Cookie.get('userid')

    if (token && id)
      ProfileDaemon.setState({ profile: { token, id }, isAuthenticated: true })
  }

  static fetch() {
    if (Cookie.get('userid') != undefined)
      ApiRequest.profile().then((user) =>
        ProfileDaemon.setState({
          user,
          isBanned: !!user?.banned,
          isStaff: (user?.role ?? UserRole.User) >= UserRole.Moderator,
          isLoaded: !!user
        })
      )
  }

  static login(token: string, id: string) {
    ProfileDaemon.setState({ profile: { token, id } })
  }

  static logout() {
    ProfileDaemon.setState({ profile: null, user: null })
    Cookie.clear()
  }

  static destroy() {
    ProfileDaemon.setState(initialState)
  }

  private static setState(state: Partial<ProfileState>) {
    ProfileDaemon.store.setState(
      state as Pick<ProfileState, keyof ProfileState>
    )
  }

  static get state(): ProfileState {
    return ProfileDaemon.store.getState()
  }

  static on(f: Listener<ProfileState>) {
    ProfileDaemon.store.subscribe(f)
  }

  static off(f: Listener<ProfileState>) {
    ProfileDaemon.store.unsubscribe(f)
  }
}
