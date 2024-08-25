import { ProfileInfo } from '../api'

export interface ProfileState {
  user: null | ProfileInfo
  profile: null | { token: string; id: string }
}
