export interface NotificationInfo {
  message: string
  title: string
  type: 'error' | 'success'
  id: string
}

export interface NotificationState {
  list: NotificationInfo[]
}
