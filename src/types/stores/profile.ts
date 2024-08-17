import { ProfileInfo } from '../api'

export interface ProfileState {
  profile: ProfileInfo | undefined
  isAuthenticated: boolean
  isBanned: boolean
  isStaff: boolean
}
