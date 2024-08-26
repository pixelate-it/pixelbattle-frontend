import { AppCookie } from 'src/classes/AppCookie'
import { AppRequests } from 'src/classes/AppRequests'
import {
  ComputedActions,
  createComputedStore
} from 'src/hooks/createComputedStore'
import { UserRole } from 'src/types/api'
import { ProfileState } from 'src/types/managers'
import createStore from 'unistore'

interface ProfileComputedActions extends ComputedActions<ProfileState> {
  isAuthenticated: (state: ProfileState) => boolean
  isBanned: (state: ProfileState) => boolean
  isStaff: (state: ProfileState) => boolean
}

export const ProfileStore = createStore<ProfileState>({
  user: null,
  profile: null
})
export const ComputedProfileStore = createComputedStore<
  ProfileState,
  ProfileComputedActions
>(ProfileStore, {
  isAuthenticated: (state) => !!state.profile,
  isBanned: (state) => !!state.user?.banned,
  isStaff: (state) => (state.user?.role ?? UserRole.User) >= UserRole.Moderator
})

export const ProfileManager = {
  load() {
    const token = AppCookie.get('token')
    const id = AppCookie.get('userid')

    if (token && id) ProfileStore.setState({ profile: { token, id } })
  },
  fetch() {
    AppRequests.profile().then((user) => ProfileStore.setState({ user }))
  },
  login(token: string, id: string) {
    ProfileStore.setState({ profile: { token, id } })
  },
  logout() {
    ProfileStore.setState({ profile: null, user: null })
    AppCookie.clear()
  }
}
