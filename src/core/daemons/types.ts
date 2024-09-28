import { ProfileInfo, PixelInfo, FormattedTag } from '../classes/api/types'
import Color from '../classes/primitives/Color'
import { OverlayImage } from '../classes/primitives/OverlayImage'

export interface CooldownState {
  startRequestTime: number
  progress: number
  reqId: number
  startTime: number
  hasCooldown: boolean
}

export interface InfoState {
  name: string
  ended: boolean
  cooldown: number
  online: number
  canvas: {
    width: number
    height: number
  }
}

export interface NotificationInfo {
  message: string
  title: string
  type: 'error' | 'success'
  id: string
}

export interface NotificationState {
  list: NotificationInfo[]
}

export interface OverlaysState {
  image: OverlayImage | null
  imageName: string | null
  position: { x: number; y: number } | null
  opacity: number | null
  currentId: number
}

export interface ProfileState {
  isAuthenticated: boolean
  isBanned: boolean
  isStaff: boolean
  isLoaded: boolean
  user: null | ProfileInfo
  profile: null | { token: string; id: string }
}

export interface PaletteState {
  colors: Array<Color>
  selected: Color
}

export interface PointerState {
  coordinates: [number, number]
  empty: boolean
  info: PixelInfo | null | 'loading'
}

export interface TagsState {
  loaded: boolean
  tags: FormattedTag[]
  selectedTag: string
  isTagCreateOpened: boolean
}

export interface ToolsState {
  pickerIsEnabled: boolean
}

export interface NotificationInfo {
  message: string
  title: string
  type: 'error' | 'success'
  id: string
}

export interface GeneralState {
  canvasLoaded: boolean
  infoLoaded: boolean
}
