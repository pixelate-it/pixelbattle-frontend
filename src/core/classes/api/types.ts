import { NotificationInfo } from 'src/core/daemons/types'

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
