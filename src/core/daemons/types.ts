import { GuiContainer } from '../place/gui/container'
import Color from '../util/сolor'
import { Overlay } from '../util/overlay'
import { InternalError } from '../util/errors'

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
  type: NotificationType | string
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
  gui: boolean
  save: boolean
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
  visible: boolean
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

export interface GuiState {
  containers: Array<GuiContainer>
  current: number | null
}

export interface GeneralState {
  status: GeneralStatus
}

export enum GeneralStatus {
  CORRECT,
  CONNECTING,
  WEBSOCKET_ERROR,
  INTERNAL_ERROR
}

export interface ErrorState {
  isErrored: boolean
  internalError?: InternalError
}

export enum WebSocketStatus {
  CONNECTING,
  ACTIVE,
  CLOSED,
  ERRORED
}

export enum WebSocketError {
  NORMALLY,
  AWAY,
  CONNECTION,
  PROTOCOL,
  INTERNAL
}

export interface WebSocketState {
  status: WebSocketStatus
  error?: WebSocketError
  attempts: number
}

// Requests

export interface ApiInfo {
  name: string
  ended: boolean
  cooldown: number
  online: number
  canvas: {
    width: number
    height: number
  }
}

export interface ApiPixel {
  color: string
  x: number
  y: number
}

export interface PixelInfo {
  author: string | null
  tag: string | null
}

export interface ProfileInfo {
  userID: string
  cooldown: number
  tag: string | null
  banned: BanInfo | null
  username: string
  role: UserRole
}

export enum UserRole {
  User = 0,
  Moderator = 1,
  Admin = 2
}

export interface BanInfo {
  moderatorID: string
  timeout: number
  reason: string | null
}

export interface ApiTags {
  tags: ApiTag[]
  pixels: {
    all: number
    used: number
    unused: number
  }
}

export type ApiTag = [string, number]

export interface FormattedTag {
  name: string
  pixels: number
  place: number
}

export interface ApiResponse {
  error: boolean
  reason: string
}

export interface ApiErrorResponse extends ApiResponse {
  error: true
}

export type NotificationMap = {
  [key: string]: Omit<NotificationInfo, 'id' | 'type'>
}

export interface PlaceMessageData {
  op: 'PLACE'
  x: number
  y: number
  color: string
}

export interface EndedMessageData {
  op: 'ENDED'
  value: boolean
}

export type MessageData = PlaceMessageData | EndedMessageData
