import { ProfileInfo, PixelInfo, FormattedTag } from '../classes/api/types'
import Color from '../classes/primitives/Color'
import { Overlay } from '../classes/primitives/Overlay'

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
  type: NotificationType
  id: string
}

export enum NotificationType {
  ERROR,
  SUCCESS,
  DEBUG
}

export interface NotificationState {
  list: NotificationInfo[]
}

export interface OverlaysState {
  overlays: Array<Overlay>
  currentOverlay: number
  prevOverlayButtonActive: boolean
  nextOverlayButtonActive: boolean
  viewMode: OverlayViewMode
  editingMode: boolean
}

export type OverlayViewMode = 0 | 1 | 2

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
  lockedPaletteGrowing: boolean
}

export interface GeneralState {
  canvasLoaded: boolean
  infoLoaded: boolean
}
